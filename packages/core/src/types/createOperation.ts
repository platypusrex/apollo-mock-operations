import { GraphQLError } from 'graphql';
import type { GraphqlError, NetworkError, OperationLoading, ResolverFn } from './shared';

export type LoadingPayload = {
  variant: 'loading';
};

export type GraphQLErrorPayload<TModels = any> = {
  variant: 'graphql-error';
  error?: PayloadFn<GraphQLError, TModels>;
};

export type NetworkErrorPayload<TModels = any> = {
  variant: 'network-error';
  error?: PayloadFn<Error, TModels>;
};

export type DataPayload<T, TModels = any> =
  T extends GraphqlError | NetworkError | OperationLoading
    ? never
    : T extends Promise<infer U>
      ? { variant: 'data'; data: PayloadFn<U, TModels> }
      : { variant: 'data'; data: PayloadFn<T, TModels> }

export type OperationPayload<T, TModels = any> =
  | LoadingPayload
  | GraphQLErrorPayload<TModels>
  | NetworkErrorPayload<TModels>
  | DataPayload<T, TModels>;

type PayloadFn<T, TModels = any> = T | ((models: TModels) => T)

export type OperationStatePayload<
  TMockOperation extends ResolverFn<any, any, any, any>,
  TOperationState extends string,
  TModels = any
> = Required<
  Record<
    TOperationState,
    OperationPayload<ReturnType<TMockOperation>, TModels>
  >
>;

export type CreateOperationState<
  TMockOperation extends ResolverFn<any, any, any, any>,
  TOperationState extends string,
  TModels = any
> = {
  defaultState: TOperationState,
  resolver:
    | ((...args: Parameters<TMockOperation>) => OperationStatePayload<TMockOperation, TOperationState, TModels>)
    | OperationStatePayload<TMockOperation, TOperationState, TModels>
}
