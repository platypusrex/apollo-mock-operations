import React from 'react';
import { buildClientSchema } from 'graphql/utilities';
import type { GraphQLSchema, IntrospectionQuery } from 'graphql';
import type { GraphQLArgument } from 'graphql/type/definition';
import type { MockGQLOperationMap } from '../types';
import { MockedDevTools } from './ApolloMockedDevtools';

type GetDevToolsComponentOptions<TOperations extends MockGQLOperationMap<any>> = {
  operations: TOperations;
  introspection: IntrospectionQuery;
  enabled?: boolean;
};

type GetDevToolsComponentResponse = React.FC;

export function getDevToolsComponent<TOperations extends MockGQLOperationMap<any>>({
  operations,
  introspection,
  enabled,
}: GetDevToolsComponentOptions<TOperations>): GetDevToolsComponentResponse {
  if (!enabled) return () => null;
  const getOperationArgs = (args: ReadonlyArray<GraphQLArgument>) =>
    args.reduce<Record<string, any>>((acc, arg) => {
      // @ts-ignore
      const argTypeObj = arg.type.ofType;
      const argTypeFields = argTypeObj._fields;
      if (!!argTypeFields) {
        acc[arg.name] = {};
      }
      return acc;
    }, {} as Record<string, any>);

  const extractOperationState = (operationState: MockGQLOperationMap<any>, type: 'query' | 'mutation') => {
    const schemaInfo: GraphQLSchema = buildClientSchema(introspection);
    const queryTypeFields = schemaInfo.getQueryType()?.getFields();
    const mutationTypeFields = schemaInfo.getMutationType()?.getFields();

    return operationState[type].map((operation) => {
      const [[name, state]] = Object.entries(operation);
      let operationArgs = {};

      if (type === 'query' && queryTypeFields) {
        operationArgs = getOperationArgs(queryTypeFields[name].args);
      }

      if (type === 'mutation' && mutationTypeFields) {
        operationArgs = getOperationArgs(mutationTypeFields[name].args);
      }

      const operationResults =
        typeof state.resolver === 'function' ? state.resolver({}, operationArgs, {}, {}) : state.resolver;

      return {
        [name]: {
          defaultState: state.defaultState,
          options: Object.keys(operationResults)
        }
      };
    });
  };

  const operationMap = {
    query: extractOperationState(operations, 'query'),
    mutation: extractOperationState(operations, 'mutation'),
  };

  return (): React.ReactElement => (
    <MockedDevTools operationMap={operationMap} />
  );
}
