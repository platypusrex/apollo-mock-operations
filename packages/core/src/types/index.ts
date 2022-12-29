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
import { ReactNode } from 'react';
import { OperationModel } from '../OperationModel';

export type AnyObject<T = any> = Record<string, T>;

export type RequireAtLeastOne<T> = {
  [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

export type NonEmptyArray<T> = [T, ...T[]];

type ExtractReturnTypeKeysByValue<T, V> = { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T];
export type OmitNonPrimitive<T, V> = Pick<T, ExtractReturnTypeKeysByValue<T, V>>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type DeepPartial<T> = T extends Function
  ? T
  : T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

export type WhereQuery<T extends OperationType<any, any>> = {
  where: RequireAtLeastOne<
    OmitNonPrimitive<
      {
        [K in keyof Omit<ResolverReturnType<T[keyof T]>, '__typename'>]: ResolverReturnType<
          T[keyof T]
        >[K];
      },
      Maybe<any[] | AnyObject>
    >
  >;
};

export interface OperationMeta {
  query: string;
  operationName: string;
  variables: { [key: string]: any };
  result: { [key: string]: any };
}

export interface CreateLinkOptions {
  delay?: number;
  onResolved?: (operationMeta: OperationMeta) => void;
  loading?: boolean;
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

// Create operation types
type ResultType = 'graphql-error' | 'network-error' | 'loading' | 'data'

type LoadingResponse = {
  variant: Extract<ResultType, 'loading'>;
};

type GraphQLErrorResponse = {
  variant: Extract<ResultType, 'graphql-error'>;
  error?: GraphQLError;
};

type NetworkErrorResponse = {
  variant: Extract<ResultType, 'network-error'>;
  error?: Error;
};

type PayloadResponse<T> =
  T extends GraphqlError | NetworkError | OperationLoading
    ? never
    : T extends Promise<infer U>
      ? { variant: Extract<ResultType, 'data'>; data: U }
      : { variant: Extract<ResultType, 'data'>; data: T };

export type OperationResult<T> =
  | LoadingResponse
  | GraphQLErrorResponse
  | NetworkErrorResponse
  | PayloadResponse<T>;

export interface OperationStateObject<
  TOperationState extends string,
  TOperationReturn extends ReturnType<OperationType<any, any>[keyof OperationType<any, any>]>,
  TModels = any
> {
  state: TOperationState;
  result: OperationResult<TOperationReturn> | ((models: TModels) => OperationResult<TOperationReturn>);
}

export type OperationResultTuple<
  TOperationState extends readonly string[],
  TOperationReturn,
  TModels
> = {
  [I in keyof TOperationState]: OperationStateObject<TOperationState[I], TOperationReturn, TModels>
} & { length: TOperationState['length'] };


export type CreateOperationState<
  TMockOperation extends OperationType<any, any>[keyof TMockOperation],
  TOperationState extends readonly string[],
  TModels = any
> =
  | ((
    parent: Parameters<TMockOperation>[0],
    args: Parameters<TMockOperation>[1],
    context: Parameters<TMockOperation>[2],
    info: Parameters<TMockOperation>[3]
  ) => OperationResultTuple<TOperationState, ReturnType<TMockOperation>, TModels>)
  | OperationResultTuple<TOperationState, ReturnType<TMockOperation>, TModels>;

// MockGQLOperations supporting types
export type GraphqlError = { graphQLError?: GraphQLError };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphqlError | NetworkError | OperationLoading;

export type OperationType<TResult, TArgs> = Record<
  keyof TResult,
  ResolverFn<TResult[keyof TResult], AnyObject, AnyObject, TArgs>
>;

export type OperationFn<TState, TResult, TArgs> = (
  scenario: TState
) => OperationType<TResult, TArgs>;

export interface OperationState<TMockOperation, TOperationState extends readonly string[]> {
  operation: TMockOperation;
  state: Record<keyof TMockOperation, TOperationState>;
}

// Operation model supporting types
export type OperationModelType<TMockOperation extends OperationType<any, any>> = Record<
  keyof TMockOperation,
  OperationModel<TMockOperation>
>;

export type ResolverReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R extends GraphqlError | NetworkError | OperationLoading | Promise<any>
    ? never
    : NonNullable<R>
  : never;
