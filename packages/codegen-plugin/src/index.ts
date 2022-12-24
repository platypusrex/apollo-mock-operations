import {
  concatAST,
  FragmentDefinitionNode,
  GraphQLSchema,
  Kind,
  OperationDefinitionNode,
} from 'graphql';
import { PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { LoadedFragment, optimizeOperations } from '@graphql-codegen/visitor-plugin-common';
import { TypeScriptDocumentsPluginConfig } from './config';
import { TypeScriptDocumentsVisitor } from './visitor';

export const plugin: PluginFunction<TypeScriptDocumentsPluginConfig, Types.ComplexPluginOutput> = (
  schema: GraphQLSchema,
  rawDocuments: Types.DocumentFile[],
  config: TypeScriptDocumentsPluginConfig
) => {
  const documents = config.flattenGeneratedTypes
    ? optimizeOperations(schema, rawDocuments, {
        includeFragments: !!config.flattenGeneratedTypesIncludeFragments,
      })
    : rawDocuments;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const allAst = concatAST(documents.map((v) => v.document!));

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        (d) => d.kind === Kind.FRAGMENT_DEFINITION
      ) as FragmentDefinitionNode[]
    ).map((fragmentDef) => ({
      isExternal: false,
      name: fragmentDef.name.value,
      node: fragmentDef,
      onType: fragmentDef.typeCondition.name.value,
    })),
    ...(config.externalFragments ?? []),
  ];

  const visitor = new TypeScriptDocumentsVisitor(schema, config, allFragments);
  const operationNodes = allAst.definitions.filter(
    (d) => d.kind === 'OperationDefinition'
  ) as OperationDefinitionNode[];

  const definitions = visitor.getOperationDefinition(operationNodes);
  const operationDefinitions = definitions.map((def) => def.definition);
  const operationObjectArr = definitions.map((def) => def.operation);
  const combinedOperationDefinitions = visitor.getCombinedOperationsDefinition(operationObjectArr);

  if (config.addOperationExport) {
    const exportConsts: any[] = [];

    allAst.definitions.forEach((d) => {
      if ('name' in d) {
        exportConsts.push(`export declare const ${d.name?.value}: import("graphql").DocumentNode;`);
      }
    });
  }

  const imports = `import { GraphQLError, GraphQLResolveInfo } from 'graphql';`;
  const headers = `
export type GraphqlError = { graphQLError?: GraphQLError };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphqlError | NetworkError | OperationLoading;

type ResolverType<TResult, TArgs> = Record<keyof TResult, ResolverFn<TResult[keyof TResult], {}, {}, TArgs>>;  
  `;

  return {
    content: [headers, ...operationDefinitions, ...combinedOperationDefinitions].join('\n'),
    prepend: [
      imports,
      ...visitor.getImports(),
      ...visitor.getGlobalDeclarations(visitor.config.noExport),
    ],
  };
};

export { TypeScriptDocumentsVisitor };
