import {
  GraphQLNamedType,
  GraphQLOutputType,
  GraphQLSchema,
  isEnumType,
  isNonNullType,
  OperationDefinitionNode,
  OperationTypeNode,
  VariableDefinitionNode,
} from 'graphql';
import {
  AvoidOptionalsConfig,
  BaseDocumentsVisitor,
  DeclarationBlock,
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
import { TypeScriptDocumentsPluginConfig } from './config';
import { SelectionSetToObject } from './set-selection-set-to-object';
import { TypeScriptOperationVariablesToObject } from './ts-operation-variables-to-object';
import { TypeScriptSelectionSetProcessor } from './ts-selection-set-processor';

type SelectionSetObject = Record<keyof NameAndType | 'operationKind', string>;

export interface TypeScriptDocumentsParsedConfig extends ParsedDocumentsConfig {
  arrayInputCoercion: boolean;
  avoidOptionals: AvoidOptionalsConfig;
  immutableTypes: boolean;
  noExport: boolean;
  maybeValue: string;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getRootType(operation: OperationTypeNode, schema: GraphQLSchema) {
  switch (operation) {
    case OperationTypeNode.QUERY:
      return schema.getQueryType();
    case OperationTypeNode.MUTATION:
      return schema.getMutationType();
    case OperationTypeNode.SUBSCRIPTION:
      return schema.getSubscriptionType();
    default:
      throw new Error(`Unknown operation type: ${operation}`);
  }
}

export class TypeScriptDocumentsVisitor extends BaseDocumentsVisitor<
  TypeScriptDocumentsPluginConfig,
  TypeScriptDocumentsParsedConfig
> {
  constructor(
    schema: GraphQLSchema,
    config: TypeScriptDocumentsPluginConfig,
    allFragments: LoadedFragment[]
  ) {
    super(
      config,
      {
        arrayInputCoercion: getConfigValue(config.arrayInputCoercion, true),
        avoidOptionals: normalizeAvoidOptionals(getConfigValue(config.avoidOptionals, false)),
        immutableTypes: getConfigValue(config.immutableTypes, false),
        noExport: getConfigValue(config.noExport, false),
        nonOptionalTypename: getConfigValue(config.nonOptionalTypename, false),
        preResolveTypes: getConfigValue(config.preResolveTypes, true),
      } as TypeScriptDocumentsParsedConfig,
      schema
    );

    const preResolveTypes = getConfigValue(config.preResolveTypes, true);
    const defaultMaybeValue = 'T | null';
    const maybeValue = getConfigValue(config.maybeValue, defaultMaybeValue);

    const wrapOptional = (type: string): string | undefined => {
      if (preResolveTypes === true) {
        return maybeValue?.replace('T', type);
      }
      const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';
      return `${prefix}Maybe<${type}>`;
    };
    const wrapArray = (type: string): string => {
      const listModifier = this.config.immutableTypes ? 'ReadonlyArray' : 'Array';
      return `${listModifier}<${type}>`;
    };

    const formatNamedField = (
      name: string,
      type: GraphQLNamedType | GraphQLOutputType | null,
      isConditional = false
    ): string => {
      const optional =
        isConditional || (!this.config.avoidOptionals.field && !!type && !isNonNullType(type));
      return (this.config.immutableTypes ? `readonly ${name}` : name) + (optional ? '?' : '');
    };

    const processorConfig: SelectionSetProcessorConfig = {
      avoidOptionals: this.config.avoidOptionals,
      convertName: this.convertName.bind(this),
      enumPrefix: this.config.enumPrefix,
      formatNamedField,
      namespacedImportName: this.config.namespacedImportName,
      scalars: this.scalars,
      wrapTypeWithModifiers(baseType, type) {
        return wrapTypeWithModifiers(baseType, type, {
          wrapArray,
          wrapOptional: wrapOptional as (type: string) => string,
        });
      },
    };
    const processor = new (
      preResolveTypes ? PreResolveTypesProcessor : TypeScriptSelectionSetProcessor
    )(processorConfig);

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
    const enumsNames = Object.keys(schema.getTypeMap()).filter((typeName) =>
      isEnumType(schema.getType(typeName))
    );
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

  getImports = (): string[] =>
    !this.config.globalNamespace && this.config.inlineFragmentTypes === 'combine'
      ? this.config.fragmentImports.map((fragmentImport) =>
          generateFragmentImportStatement(fragmentImport, 'type')
        )
      : [];

  getOperationFunctionDefinition = (
    selectionSetObject: SelectionSetObject,
    name: string,
    type: string,
    args: string
  ): { operation: { kind: string; name: string }; result: string } => {
    const content = `ResolverType<${type}, ${args}>`;
    const operationFunctionName = this.convertName(name, {
      suffix: 'MockOperation',
    });
    return {
      operation: {
        kind: selectionSetObject.operationKind,
        name: operationFunctionName,
      },
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationFunctionName)
        .withContent(content).string,
    };
  };

  getCombinedOperationsDefinition = (operations: { kind: string; name: string }[]): string[] => {
    const queryOperations = operations.filter((op) => op.kind === 'Query');
    const mutationOperations = operations.filter((op) => op.kind === 'Mutation');
    const queryContent = queryOperations.map((op) => op.name).join('\n\t & ');
    const mutationContent = mutationOperations.map((op) => op.name).join('\n\t & ');
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

    const combinedQueryContent =
      '{\n\tQuery: Partial<QueryMockOperations>;\n\tMutation: Partial<MutationMockOperations>;\n}';
    const combinedDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('MockOperations')
      .withContent(combinedQueryContent).string;

    return [queryDefinitions, mutationDefinitions, combinedDefinitions];
  };

  getOperationDefinition = (
    nodes: OperationDefinitionNode[]
  ): { definition: string; operation: { kind: string; name: string } }[] =>
    nodes.map((node) => {
      const operationRootType = getRootType(node.operation, this._schema);

      if (!operationRootType) {
        throw new Error(`Unable to find root schema type for operation type "${node.operation}"!`);
      }

      const selectionSet = this._selectionSetToObject.createNext(
        operationRootType,
        node.selectionSet
      ) as SelectionSetToObject;
      const { transformedSelectionSets } = selectionSet.transformGroupedSelections();

      const selectionSetObject = (
        transformedSelectionSets as NameAndType[]
      )?.reduce<SelectionSetObject>((acc, curr) => {
        let currentKey: keyof NameAndType | 'operationKind';
        let currentValue;
        for (const key in curr) {
          const k = key as keyof NameAndType;
          if (curr[k] === "'Query'" || curr[k] === "'Mutation'") {
            currentKey = 'operationKind';
            currentValue = curr[k].replace(/'/g, '');
          } else {
            currentKey = k;
            currentValue = curr[k];
          }

          if (currentValue !== '__typename') {
            acc[currentKey] = currentValue;
          }
        }
        return acc;
      }, {} as SelectionSetObject);

      const name = this.internalHandleAnonymousOperation(node);
      const defaultSuffix = 'MockOperation';

      const { name: args, result: argsResult } = this.getOperationArgsDefinition(
        node,
        name,
        defaultSuffix
      );
      const { name: type, result: typeResult } = this.getOperationResultDefinition(
        // @ts-ignore
        selectionSetObject,
        name,
        defaultSuffix
      );
      const { result: operationFunction, operation } = this.getOperationFunctionDefinition(
        // @ts-ignore
        selectionSetObject,
        name,
        type,
        args
      );

      return {
        definition: [argsResult, typeResult, operationFunction].join('\n'),
        operation,
      };
    });

  protected getPunctuation = (): string => ';';

  protected applyVariablesWrapper = (variablesBlock: string): string => {
    const prefix = this.config.namespacedImportName ? `${this.config.namespacedImportName}.` : '';

    return `${prefix}Exact<${
      variablesBlock === '{}' ? `{ [key: string]: never; }` : variablesBlock
    }>`;
  };

  private internalHandleAnonymousOperation = (node: OperationDefinitionNode): string => {
    const name = node.name?.value;

    if (name) {
      return this.convertName(name, {
        useTypesPrefix: false,
        useTypesSuffix: false,
      });
    }

    // eslint-disable-next-line no-plusplus
    return this.convertName(`${this._unnamedCounter++}`, {
      prefix: 'Unnamed_',
      suffix: '_',
      useTypesPrefix: false,
      useTypesSuffix: false,
    });
  };

  private getOperationArgsDefinition = (
    node: OperationDefinitionNode,
    name: string,
    suffix: string
  ): { name: string; result: string } => {
    const visitedOperationVariables = this._variablesTransfomer.transform<VariableDefinitionNode>(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node.variableDefinitions!
    );
    const operationArgsString = this.convertName(name, {
      suffix: `${suffix}Args`,
    });

    return {
      name: operationArgsString,
      result: new DeclarationBlock({
        ...this._declarationBlockConfig,
        blockTransformer: (t) => this.applyVariablesWrapper(t),
      })
        .export()
        .asKind('type')
        .withName(operationArgsString)
        .withBlock(visitedOperationVariables).string,
    };
  };

  private getOperationResultDefinition = (
    selectionSetObject: SelectionSetObject,
    name: string,
    suffix: string
  ): { name: string; result: string } => {
    const operationResultName = this.convertName(name, {
      suffix: `${suffix}Result`,
    });
    const operationResultString = `\t${selectionSetObject.name.replace('?', '')}: ${
      selectionSetObject.type
    }`;
    return {
      name: operationResultName,
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationResultName)
        .withBlock(operationResultString).string,
    };
  };
}
