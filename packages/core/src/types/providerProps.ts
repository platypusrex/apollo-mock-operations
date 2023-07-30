import * as React from 'react';
import type { ReactNode } from 'react';
import type {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject
} from '@apollo/client';
import type { MockGQLOperationsType } from './operationMock';
import type { OperationMeta } from './shared';
import type { RequireAtLeastOne } from './util';

type ClientOptions = Pick<
  ApolloClientOptions<NormalizedCacheObject>,
  | 'headers'
  | 'queryDeduplication'
  | 'defaultOptions'
  | 'assumeImmutableResults'
  | 'typeDefs'
  | 'fragmentMatcher'
  | 'connectToDevTools'
>;

type CacheOptions = Omit<InMemoryCacheConfig, 'addTypename'>;

export type OperationStateType<TMockOperations extends MockGQLOperationsType> =
  & { [K in keyof TMockOperations['Query']]: TMockOperations['Query'][K]['state']}
  & { [K in keyof TMockOperations['Mutation']]: TMockOperations['Mutation'][K]['state']};

export type MergeResolversType<TMockOperations extends MockGQLOperationsType> =
  & { [K in keyof TMockOperations['Query']]: TMockOperations['Query'][K]['resolver']}
  & { [K in keyof TMockOperations['Mutation']]: TMockOperations['Mutation'][K]['resolver']};

export type ProtectedMockedProviderProps = {
  onResolved?: (operationMeta: OperationMeta) => void;
}

export type MockProviderProps<
  TMockOperations extends MockGQLOperationsType,
  TModels = any
> = {
  loading?: boolean;
  operationState?: RequireAtLeastOne<OperationStateType<TMockOperations>>
  mergeOperations?:
    | RequireAtLeastOne<MergeResolversType<TMockOperations>>
    | ((models: TModels) => RequireAtLeastOne<MergeResolversType<TMockOperations>>);
  delay?: number;
  cacheOptions?: CacheOptions;
  clientOptions?: ClientOptions;
  links?: (cache?: InMemoryCache) => ApolloLink[];
  Provider?: React.ComponentType<any>;
  children?: ReactNode;
};
