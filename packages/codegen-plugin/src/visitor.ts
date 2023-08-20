import { cosmiconfigSync } from 'cosmiconfig';
import { TypeScriptLoader } from 'cosmiconfig-typescript-loader';
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
  block,
  DeclarationBlock,
  generateFragmentImportStatement,
  getConfigValue,
  indent,
  indentMultiline,
  LoadedFragment,
  NameAndType,
  normalizeAvoidOptionals,
  ParsedDocumentsConfig,
  PreResolveTypesProcessor,
  SelectionSetProcessorConfig,
  wrapTypeWithModifiers,
} from '@graphql-codegen/visitor-plugin-common';
import { FragmentDefinitionNode } from 'graphql/language/ast';
import { ApolloMockOperationsPluginConfig } from './config';
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
  ApolloMockOperationsPluginConfig,
  TypeScriptDocumentsParsedConfig
> {
  operationState?: Record<string, string[]>;
  defaultState: string;
  constructor(
    schema: GraphQLSchema,
    config: ApolloMockOperationsPluginConfig,
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

    this.operationState = this.loadOperationStateFromCosmicConfigFile() ?? config.operationState;
    this.defaultState = 'SUCCESS';
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
      // @ts-ignore
      enumSuffix: null,
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
      suffix: 'Operation',
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

  loadOperationStateFromCosmicConfigFile = () => {
    const moduleName = 'apolloMock';
    const result = cosmiconfigSync(moduleName, {
      searchPlaces: [
        'package.json',
        `.${moduleName}rc`,
        `.${moduleName}rc.json`,
        `.${moduleName}rc.yaml`,
        `.${moduleName}rc.yml`,
        `.${moduleName}rc.js`,
        `.${moduleName}rc.ts`,
        `${moduleName}.config.js`,
        `${moduleName}.config.ts`,
      ],
      loaders: {
        '.ts': TypeScriptLoader(),
      },
    }).search();

    return result?.config?.operationState;
  };

  getOperationTypeDefinition = (
    selectionSetObject: SelectionSetObject,
    name: string,
    type: string,
    args: string
  ): { operation: { kind: string; name: string }; result: string } => {
    const operationFunctionName = this.convertName(name, { suffix: 'Operation' });
    const operationName = `${selectionSetObject.name.replace('?', '')}`;
    const resolverFn = `ResolverFn<${type}, any, any, ${args}>`;
    const operationState =
      (this.operationState ?? {})[operationName]?.map((state) => `'${state}'`).join(' | ') ??
      `'${this.defaultState}'`;

    const operationFields = [
      `type: '${selectionSetObject.operationKind}'`,
      `resolver: ${resolverFn}`,
      ...(operationState ? [`state: ${operationState}`] : []),
    ].map((field) => indent(this.getPunctuation(field)));

    const operationTypeResult = indentMultiline(`${operationName}: ${block(operationFields)}`);

    return {
      operation: {
        kind: selectionSetObject.operationKind,
        name: operationFunctionName,
      },
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationFunctionName)
        .withBlock(operationTypeResult).string,
    };
  };

  getCombinedOperationsDefinition = (operations: { kind: string; name: string }[]): string[] => {
    const queryOperations = operations.filter((op) => op.kind === 'Query');
    const mutationOperations = operations.filter((op) => op.kind === 'Mutation');
    const queryContent = queryOperations.map((op) => op.name).join('\n\t& ');
    const mutationContent = mutationOperations.map((op) => op.name).join('\n\t& ');
    const queryDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('QueryOperations')
      .withContent(queryContent).string;
    const mutationDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('MutationOperations')
      .withContent(mutationContent).string;

    // const combinedQueryContent = indentMultiline('Query: QueryOperations; Mutation: MutationOperations;');
    const combinedQueryContent = ['Query: QueryOperations', 'Mutation: MutationOperations']
      .map((field) => indent(this.getPunctuation(field)))
      .join('\n');

    const combinedDefinitions = new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('MockOperations')
      .withBlock(combinedQueryContent).string;

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
      const defaultSuffix = 'Operation';

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
      const { operation } = this.getOperationFunctionDefinition(
        // @ts-ignore
        selectionSetObject,
        name,
        type,
        args
      );

      const { result: operationType } = this.getOperationTypeDefinition(
        // @ts-ignore
        selectionSetObject,
        name,
        type,
        args
      );

      return {
        definition: [argsResult, typeResult, operationType].join('\n'),
        operation,
      };
    });

  getCombinedModelsDefinitions = (models: { modelName: string; modelTypeDef: string }[]) => {
    const modelContent = models.map((model) => model.modelName).join(indent('\n& '));

    return new DeclarationBlock(this._declarationBlockConfig)
      .export()
      .asKind('type')
      .withName('OperationModels')
      .withContent(modelContent).string;
  };

  getModelDefinition = (nodes: FragmentDefinitionNode[]) => {
    return nodes.map((node) => {
      const fragmentRootType = this._schema.getType(node.typeCondition.name.value);
      const fragmentSuffix = 'Model';
      const selectionSet = this._selectionSetToObject.createNext(
        fragmentRootType!,
        node.selectionSet
      ) as SelectionSetToObject;
      const { modelName, modelTypeDef } = selectionSet.transformModelSelectionSetToType(
        node.name.value,
        fragmentSuffix,
        this._declarationBlockConfig
      );
      return { modelName, modelTypeDef };
    });
  };

  protected getPunctuation = (str: string): string => str.concat(';');

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
    const operationResult = selectionSetObject.type.replaceAll(',', ';');

    return {
      name: operationResultName,
      result: new DeclarationBlock(this._declarationBlockConfig)
        .export()
        .asKind('type')
        .withName(operationResultName)
        .withContent(operationResult).string,
    };
  };
}
