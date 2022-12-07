import * as React from 'react';
import { IResolvers, Maybe } from '@graphql-tools/utils';
import { GraphQLError, GraphQLResolveInfo, IntrospectionQuery } from 'graphql';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client';
import { OperationModel } from '../OperationModel';
import { ReactNode } from 'react';

export type AnyObject<T = any> = Record<string, T>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type RequireOnlyOne<T, Keys extends keyof T = keyof T> =
  Pick<T, Exclude<keyof T, Keys>>
  & {
  [K in Keys]-?:
  Required<Pick<T, K>>
  & Partial<Record<Exclude<Keys, K>, undefined>>
}[Keys];

export type NonEmptyArray<T> = [T, ...T[]];

type ExtractReturnTypeKeysByValue<T, V> =
  { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]
export type OmitNonPrimitive<T, V> = Pick<T, ExtractReturnTypeKeysByValue<T, V>>;

export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
    ? { [P in keyof T]?: DeepPartial<T[P]> }
    : T;

export type WhereQuery<T extends OperationType<any, any>> = {
  where: RequireAtLeastOne<
    OmitNonPrimitive<
      { [K in keyof Omit<ResolverReturnType<T[keyof T]>, '__typename'>]: ResolverReturnType<T[keyof T]>[K] },
      Maybe<any[] | AnyObject>
    >
  >;
}

export interface OperationMeta {
  query: string;
  operationName: string;
  variables: { [key: string]: any };
  result: { [key: string]: any };
}

export interface CreateLinkOptions {
  delay?: number;
  onResolved?: (operationMeta: OperationMeta) => void;
}

export interface LinkSchemaProps extends CreateLinkOptions {
  resolvers: IResolvers;
  introspectionResult: IntrospectionQuery | any;
  rootValue?: any;
  context?: any;
}

// types for provider
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

export interface MockProviderProps<TOperationState extends OperationState<any, any>, TModels = any> {
  loading?: boolean;
  operationState?: RequireAtLeastOne<TOperationState['state']>;
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

// Create operation types
export interface OperationStateObject<TOperationState, TOperationReturn, TModels> {
  state: TOperationState;
  result: TOperationReturn | ((models: TModels) => TOperationReturn);
}

export type CreateOperationState<
  TMockOperation extends OperationType<any, any>[keyof TMockOperation],
  TOperationState,
  TModels = any
> =
  | ((
  parent: Parameters<TMockOperation>[0],
  args: Parameters<TMockOperation>[1],
  context: Parameters<TMockOperation>[2],
  info: Parameters<TMockOperation>[3]
) => NonEmptyArray<OperationStateObject<TOperationState, ReturnType<TMockOperation>, TModels>>)
  | NonEmptyArray<OperationStateObject<TOperationState, ReturnType<TMockOperation>, TModels>>;

// MockGQLOperations supporting types
export type GraphQLErrors = { graphQLErrors?: GraphQLError | GraphQLError[] };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphQLErrors | NetworkError | OperationLoading;

export type OperationType<TResult, TArgs> = Record<
  keyof TResult,
  ResolverFn<TResult[keyof TResult], AnyObject, AnyObject, TArgs>
>;

export type OperationFn<TState, TResult, TArgs> = (
  scenario: TState
) => OperationType<TResult, TArgs>;

export interface OperationState<TMockOperation, TOperationState> {
  operation: TMockOperation;
  state: Record<keyof TMockOperation, TOperationState>;
}

// Operation model supporting types
export type OperationModelType<TMockOperation extends OperationType<any, any>> = Record<
  keyof TMockOperation,
  OperationModel<TMockOperation>
>;

export type ResolverReturnType<T extends (...args: any) => any> =
  T extends (...args: any) => infer R
    ? R extends
      | GraphQLErrors
      | NetworkError
      | OperationLoading
      | Promise<any>
      ? never
      : NonNullable<R>
    : never;

export type ResolverReturnTypeTwo<T extends OperationType<any, any>> =
  T[keyof T] extends (...args: any) => infer R
    ? R extends
      | GraphQLErrors
      | NetworkError
      | OperationLoading
      | Promise<any>
      ? never
      : NonNullable<R>
    : never;
