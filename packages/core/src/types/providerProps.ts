import * as React from 'react';
import type { ReactNode } from 'react';
import type {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject
} from '@apollo/client';
import type { OperationMeta, OperationState } from './shared';
import type { RequireAtLeastOne } from './utility';

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

export interface MockProviderProps<
  TOperationState extends OperationState<any, any>,
  TModels = any
> {
  loading?: boolean;
  operationState?: RequireAtLeastOne<TOperationState['state']>[number];
  mergeOperations?:
    | RequireAtLeastOne<TOperationState['operation']>
    | ((models: TModels) => RequireAtLeastOne<TOperationState['operation']>);
  delay?: number;
  cacheOptions?: CacheOptions;
  clientOptions?: ClientOptions;
  links?: (cache?: InMemoryCache) => ApolloLink[];
  Provider?: React.ComponentType<any>;
  children?: ReactNode;
}

export interface ProtectedMockedProviderProps {
  onResolved?: (operationMeta: OperationMeta) => void;
}
