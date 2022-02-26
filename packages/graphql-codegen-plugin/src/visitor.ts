import autoBind from 'auto-bind';
import {
  AvoidOptionalsConfig,
  BaseDocumentsVisitor,
  DeclarationBlock,
  DeclarationKind,
  generateFragmentImportStatement,
  getConfigValue,
  LoadedFragment,
  NameAndType,
  normalizeAvoidOptionals,
  ParsedDocumentsConfig,
  PreResolveTypesProcessor,
  SelectionSetProcessorConfig,
  wrapTypeWithModifiers,
} from '@graphql-codegen/visitor-plugin-common';
import {
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
  isEnumType,
  isNonNullType,
  OperationDefinitionNode,
  OperationTypeNode,
  VariableDefinitionNode
} from 'graphql';
import { SelectionSetToObject } from './set-selection-set-to-object';
import { TypeScriptDocumentsPluginConfig } from './config';
import { TypeScriptOperationVariablesToObject } from './ts-operation-variables-to-object';
import { TypeScriptSelectionSetProcessor } from './ts-selection-set-processor';
// import { pascalCase } from 'change-case-all';

type SelectionSetObject = Record<keyof NameAndType | 'operationKind', string>;

export interface TypeScriptDocumentsParsedConfig extends ParsedDocumentsConfig {
  arrayInputCoercion: boolean;
  avoidOptionals: AvoidOptionalsConfig;
  immutableTypes: boolean;
  noExport: boolean;
  maybeValue: string;
}

function getRootType(operation: OperationTypeNode, schema: GraphQLSchema) {
  switch (operation) {
    case 'query':
      return schema.getQueryType();
    case 'mutation':
      return schema.getMutationType();
    case 'subscription':
      return schema.getSubscriptionType();
  }
  throw new Error(`Unknown operation type: ${operation}`);
}

export class TypeScriptDocumentsVisitor extends BaseDocumentsVisitor<
  TypeScriptDocumentsPluginConfig,
  TypeScriptDocumentsParsedConfig
> {
  constructor(schema: GraphQLSchema, config: TypeScriptDocumentsPluginConfig, allFragments: LoadedFragment[]) {
    super(
      config,
      {
        arrayInputCoercion: getConfigValue(config.arrayInputCoercion, true),
        noExport: getConfigValue(config.noExport, false),
        avoidOptionals: normalizeAvoidOptionals(getConfigValue(config.avoidOptionals, false)),
        immutableTypes: getConfigValue(config.immutableTypes, false),
        nonOptionalTypename: getConfigValue(config.nonOptionalTypename, false),
        preResolveTypes: getConfigValue(config.preResolveTypes, true),
      } as TypeScriptDocumentsParsedConfig,
      schema
    );

    autoBind(this);

    const preResolveTypes = getConfigValue(config.preResolveTypes, true);
    const defaultMaybeValue = 'T | null';
    const maybeValue = getConfigValue(config.maybeValue, defaultMaybeValue);

    const wrapOptional = (type: string) => {
      if (preResolveTypes === true) {
        return maybeValue!.replace('T', type);
      }
      const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';
      return `${prefix}Maybe<${type}>`;
    };
    const wrapArray = (type: string) => {
      const listModifier = this.config.immutableTypes ? 'ReadonlyArray' : 'Array';
      return `${listModifier}<${type}>`;
    };

    const formatNamedField = (
      name: string,
      type: GraphQLOutputType | GraphQLNamedType | null,
      isConditional = false
    ): string => {
      const optional = isConditional || (!this.config.avoidOptionals.field && !!type && !isNonNullType(type));
      return (this.config.immutableTypes ? `readonly ${name}` : name) + (optional ? '?' : '');
    };

    const processorConfig: SelectionSetProcessorConfig = {
      namespacedImportName: this.config.namespacedImportName,
      convertName: this.convertName.bind(this),
      enumPrefix: this.config.enumPrefix,
      scalars: this.scalars,
      formatNamedField,
      wrapTypeWithModifiers(baseType, type) {
        return wrapTypeWithModifiers(baseType, type, { wrapOptional, wrapArray });
      },
      avoidOptionals: this.config.avoidOptionals,
    };
    const processor = new (preResolveTypes ? PreResolveTypesProcessor : TypeScriptSelectionSetProcessor)(
      processorConfig
    );

    this.setSelectionSetHandler(
      new SelectionSetToObject(
        processor,
        this.scalars,
        this.schema,
        this.convertName.bind(this),
        this.getFragmentSuffix.bind(this),
        allFragments,
        this.config
      ) as any
    );
    const enumsNames = Object.keys(schema.getTypeMap()).filter(typeName => isEnumType(schema.getType(typeName)));
    this.setVariablesTransformer(
      new TypeScriptOperationVariablesToObject(
        this.scalars,
        this.convertName.bind(this),
        !!this.config.avoidOptionals.object,
        this.config.immutableTypes,
        this.config.namespacedImportName,
        enumsNames,
        this.config.enumPrefix,
        this.config.enumValues,
        this.config.arrayInputCoercion,
        undefined,
        'InputMaybe'
      )
    );
    this._declarationBlockConfig = {
      ignoreExport: this.config.noExport,
    };
  }

  public getImports(): Array<string> {
    return !this.config.globalNamespace && this.config.inlineFragmentTypes === 'combine'
      ? this.config.fragmentImports.map(fragmentImport => generateFragmentImportStatement(fragmentImport, 'type'))
      : [];
  }

  protected getPunctuation(_declarationKind: DeclarationKind): string {
    return ';';
  }

  protected applyVariablesWrapper(variablesBlock: string): string {
    const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';

    return `${prefix}Exact<${variablesBlock === '{}' ? `{ [key: string]: never; }` : variablesBlock}>`;
  }

  private internalHandleAnonymousOperation(node: OperationDefinitionNode): string {
    const name = node.name && node.name.value;

    if (name) {
      return this.convertName(name, {
        useTypesPrefix: false,
        useTypesSuffix: false,
      });
    }

    return this.convertName(this._unnamedCounter++ + '', {
      prefix: 'Unnamed_',
      suffix: '_',
      useTypesPrefix: false,
      useTypesSuffix: false,
    });
  }

  private getOperationArgsDefinition(
    node: OperationDefinitionNode,
    name: string,
    suffix: string
  ) {
    const visitedOperationVariables = this._variablesTransfomer.transform<VariableDefinitionNode>(
      node.variableDefinitions!
    );
    const operationArgsString = this.convertName(name, {
      suffix: suffix + 'Args',
    });

    return {
      name: operationArgsString,
      result: new DeclarationBlock({
        ...this._declarationBlockConfig,
        blockTransformer: t => this.applyVariablesWrapper(t),
      })
        .export()
        .asKind('type')
        .withName(operationArgsString)
        .withBlock(visitedOperationVariables).string
    }
  }

  private getOperationResultDefinition(
    selectionSetObject: SelectionSetObject,
    name: string,
    suffix: string
  ) {
    const operationResultName = this.convertName(name, {
      suffix: suffix + 'Result',
    })
    const operationResultString = `\t${selectionSetObject.name.replace('?', '')}: ${selectionSetObject.type}`;
    return {
      name: operationResultName,
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationResultName)
        .withBlock(operationResultString).string
    }
  }

  getOperationFunctionDefinition(
    selectionSetObject: SelectionSetObject,
    name: string,
    type: string,
    args: string
  ) {
    const content = `ResolverType<${type}, ${args}>`
    const operationFuntionName = this.convertName(name, {
      suffix: 'MockOperation',
    });
    return {
      operation: {
        kind: selectionSetObject.operationKind,
        name: operationFuntionName,
      },
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationFuntionName)
        .withContent(content).string
    }
  }

  getCombinedOperationsDefinition(operations: { kind: string; name: string }[]) {
    const queryOperations = operations.filter(op => op.kind === 'Query');
    const mutationOperations = operations.filter(op => op.kind === 'Mutation');
    const queryContent = queryOperations.map(op => op.name).join('\n\t & ')
    const mutationContent = mutationOperations.map(op => op.name).join('\n\t &' )
    const queryDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('QueryMockOperations')
      .withContent(queryContent).string;
    const mutationDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('MutationMockOperations')
      .withContent(mutationContent).string;

    const combinedQueryContent = '{\n\tQuery: Partial<QueryMockOperations>;\n\tMutation: Partial<MutationMockOperations>;\n}';
    const combinedDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('MockOperations')
      .withContent(combinedQueryContent).string;

    return [queryDefinitions, mutationDefinitions, combinedDefinitions]
  }

  getOperationDefinition(nodes: OperationDefinitionNode[]) {
    return nodes.map(node => {
      const operationRootType = getRootType(node.operation, this._schema);

      if (!operationRootType) {
        throw new Error(`Unable to find root schema type for operation type "${node.operation}"!`);
      }

      const selectionSet = this._selectionSetToObject.createNext(
        operationRootType,
        node.selectionSet
      ) as SelectionSetToObject;
      const { transformedSelectionSets } = selectionSet.transformGroupedSelections();

      const selectionSetObject = (transformedSelectionSets as NameAndType[])?.reduce<SelectionSetObject>(
        (acc, curr) => {
        let currentKey: keyof NameAndType | 'operationKind';
        let currentValue;
        for (const key in curr) {
          const k = key as keyof NameAndType;
          if (curr[k] === "'Query'" || curr[k] === "'Mutation'") {
            currentKey = 'operationKind';
            currentValue = curr[k].replace(/'/g,'');
          } else {
            currentKey = k;
            currentValue = curr[k];
          }

          if (currentValue !== '__typename') {
            acc[currentKey] = currentValue;
          }
        }
        return acc;
      }, {} as SelectionSetObject)

      const name = this.internalHandleAnonymousOperation(node);
      const defaultSuffix = 'MockOperation';

      const { name: args, result: argsResult } = this.getOperationArgsDefinition(node, name, defaultSuffix);
      const { name: type, result: typeResult } = this.getOperationResultDefinition(selectionSetObject, name, defaultSuffix);
      const { result: operationFunction, operation } = this.getOperationFunctionDefinition(selectionSetObject, name, type, args);

      return {
        operation,
        definition: [argsResult, typeResult, operationFunction].join('\n')
      };
    });
  }
}
