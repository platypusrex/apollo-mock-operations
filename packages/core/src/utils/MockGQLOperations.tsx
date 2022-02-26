import React, { useMemo } from 'react';
import { mergeResolvers as mergeGQLResolvers } from '@graphql-tools/merge';
import { IntrospectionQuery } from 'graphql';
import { ApolloProvider } from '@apollo/client';
import { CreateApolloClient, createApolloClient } from './createApolloClient';
import { IResolvers } from '@graphql-tools/utils';
import { MockedProviderProps, OperationFn, ProtectedMockedProviderProps, RequireAtLeastOne } from '../types';

interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation: TMutationOperations;
}

type MockGQLOperationsMerge<TQueryOperations, TMutationOperations> = RequireAtLeastOne<{
  query: TQueryOperations;
  mutation: TMutationOperations;
}>;

interface MockGQLOperationsConfig<TOperationState> {
  operations: {
    query: OperationFn<TOperationState, any, any>[];
    mutation?: OperationFn<TOperationState, any, any>[];
  };
  introspectionResult: IntrospectionQuery | any;
}

export type MockGQLOperationsType<
  TMockOperations extends Record<'operations', any>,
  TOperationState extends Record<'state', any>
> = {
  operations: TMockOperations;
  state: TOperationState;
}

export class MockGQLOperations<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  private readonly operations: MockGQLOperationsConfig<TMockGQLOperations['operations']>['operations'];
  private readonly introspectionResult: MockGQLOperationsConfig<TMockGQLOperations['operations']>['introspectionResult'];

  constructor({
    operations = { query: [], mutation: [] },
    introspectionResult,
  }: MockGQLOperationsConfig<TMockGQLOperations['state']>) {
    this.operations = operations;
    this.introspectionResult = introspectionResult;
  }

  get current() {
    return this.operations;
  }

  get MockApolloProvider(): React.FC<MockedProviderProps<TMockGQLOperations['state']>> {
    return ({
      children,
      Provider = ApolloProvider,
      operationState,
      ...rest
    }) => {
      const client = useMemo(() => {
        const providerProps = this.generateProviderProps({
          operationState,
          ...rest
        });
        return createApolloClient(providerProps)
      }, [operationState, rest.clientOptions, rest.cacheOptions, rest.delay]);
      return <Provider client={client}>{children}</Provider>;
    }
  }

  private generateProviderProps = ({
    operationState,
    delay,
    onResolved,
    ...rest }: MockedProviderProps<TMockGQLOperations['state']> & ProtectedMockedProviderProps
  ): CreateApolloClient => ({
    mocks: {
      resolvers: this.createResolvers(operationState),
      introspectionResult: this.introspectionResult,
      delay: delay,
      onResolved
    },
    ...rest
  });

  private mapOperations = (
    resolvers: OperationFn<TMockGQLOperations['state'], any, any>[],
    state?: TMockGQLOperations['state']
  ) => {
    const defaultState = (state ?? {}) as TMockGQLOperations['state'];
    return resolvers.reduce((resolver, operation) => {
      const key = Object.keys(operation({} as TMockGQLOperations['state']))[0] as keyof TMockGQLOperations['state'];
      const resolverState = Object.keys(defaultState) ? { [key]: defaultState[key] } : {};
      resolver[key as keyof MockGQLOperationsCreate<any, any>] = operation(resolverState as unknown as TMockGQLOperations['state'])[key];
      return resolver;
    }, {} as MockGQLOperationsCreate<any, any>);
  };

  private generateResolverKey = (key: keyof MockGQLOperationsConfig<any>['operations']) =>
    key.charAt(0).toUpperCase() + key.slice(1)

  private createResolvers = (state?: TMockGQLOperations['state']): IResolvers => {
    return [this.operations].reduce((resolvers, operation) => {
      const keys = Object.keys(operation);
      for (const key of (keys as Array<keyof typeof operation>)) {
        resolvers[this.generateResolverKey(key)] =
          this.mapOperations(this.operations[key] ?? [], state)
      }
      return resolvers
    }, {} as IResolvers)
  }

  merge = ({
    query,
    mutation,
  }: MockGQLOperationsMerge<
    TMockGQLOperations['operations']['Query'],
    TMockGQLOperations['operations']['Mutation']
  >): MockGQLOperationsCreate<
    TMockGQLOperations['operations']['Query'],
    TMockGQLOperations['operations']['Mutation']
  > => {
    const defaultResolvers = this.createResolvers() as any;
    const { Query, Mutation } = defaultResolvers || {};

    const customResolvers = [query, mutation].reduce((root, resolvers, i) => {
      if (Object.keys(resolvers || {}).length) {
        const res = i === 0 ? Query : Mutation;
        (root as any)[i === 0 ? 'Query' : 'Mutation'] = () => ({ ...(res ? res() : {}), ...resolvers });
      }
      return root;
    }, {});

    if (!Object.keys(customResolvers).length) {
      return defaultResolvers as MockGQLOperationsCreate<any, any>;
    }

    // @ts-ignore
    return mergeGQLResolvers([defaultResolvers, customResolvers]);
  };
}
