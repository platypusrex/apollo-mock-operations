import { oldVisit, PluginFunction, Types } from '@graphql-codegen/plugin-helpers';
import { LoadedFragment, optimizeOperations } from '@graphql-codegen/visitor-plugin-common';
import { concatAST, GraphQLSchema, Kind, FragmentDefinitionNode, OperationDefinitionNode } from 'graphql';
import { TypeScriptDocumentsVisitor } from './visitor';
import { TypeScriptDocumentsPluginConfig } from './config';

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

  const allAst = concatAST(documents.map(v => v.document!));

  const allFragments: LoadedFragment[] = [
    ...(allAst.definitions.filter(d => d.kind === Kind.FRAGMENT_DEFINITION) as FragmentDefinitionNode[]).map(
      fragmentDef => ({
        node: fragmentDef,
        name: fragmentDef.name.value,
        onType: fragmentDef.typeCondition.name.value,
        isExternal: false,
      })
    ),
    ...(config.externalFragments || []),
  ];

  const visitor = new TypeScriptDocumentsVisitor(schema, config, allFragments);
  const operationNodes = allAst.definitions
    .filter(d => d.kind === 'OperationDefinition') as OperationDefinitionNode[];

  const definitions = visitor.getOperationDefinition(operationNodes);
  const operationDefinitions = definitions.map(def => def.definition)
  const operationObjectArr = definitions.map(def => def.operation);
  const combinedOperationDefinitions = visitor.getCombinedOperationsDefinition(operationObjectArr);

  const visitorResult = oldVisit(allAst, {
    leave: visitor,
  });

  let content = visitorResult.definitions.join('\n');

  if (config.addOperationExport) {
    const exportConsts: any[] = [];

    allAst.definitions.forEach(d => {
      if ('name' in d) {
        exportConsts.push(`export declare const ${d.name?.value}: import("graphql").DocumentNode;`);
      }
    });

    content = visitorResult.definitions.concat(exportConsts).join('\n');
  }

  if (config.globalNamespace) {
    content = `
    declare global {
      ${content}
    }`;
  }

  const imports = `import { GraphQLError, GraphQLResolveInfo } from 'graphql';`;
  const headers = `
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphQLError[] | Error;

type ResolverType<TResult, TArgs> = Record<keyof TResult, ResolverFn<TResult[keyof TResult], {}, {}, TArgs>>;  
  `;

  return {
    prepend: [imports, ...visitor.getImports(), ...visitor.getGlobalDeclarations(visitor.config.noExport)],
    content: [
      headers,
      ...operationDefinitions,
      ...combinedOperationDefinitions,
    ].join('\n'),
  };
};

export { TypeScriptDocumentsVisitor };
