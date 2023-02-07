import { GraphQLError } from 'graphql';
import type { GraphqlError, NetworkError, OperationLoading, OperationType } from './shared';

type PayloadType = 'graphql-error' | 'network-error' | 'loading' | 'data';

type LoadingPayload = {
  variant: Extract<PayloadType, 'loading'>;
};

type GraphQLErrorPayload<TModels = any> = {
  variant: Extract<PayloadType, 'graphql-error'>;
  error?: PayloadFn<GraphQLError, TModels>;
};

type NetworkErrorPayload<TModels = any> = {
  variant: Extract<PayloadType, 'network-error'>;
  error?: PayloadFn<Error, TModels>;
};

type DataPayload<T, TModels = any> =
  T extends GraphqlError | NetworkError | OperationLoading
    ? never
    : T extends Promise<infer U>
      ? { variant: Extract<PayloadType, 'data'>; data: PayloadFn<U, TModels> }
      : { variant: Extract<PayloadType, 'data'>; data: PayloadFn<T, TModels> }

export type OperationPayload<T, TModels = any> =
  | LoadingPayload
  | GraphQLErrorPayload<TModels>
  | NetworkErrorPayload<TModels>
  | DataPayload<T, TModels>;

type PayloadFn<T, TModels = any> = T | ((models: TModels) => T)

export interface OperationStateObject<
  TOperationState extends string,
  TOperationReturn extends ReturnType<OperationType<any, any>[keyof OperationType<any, any>]>,
  TModels = any
> {
  state: TOperationState;
  payload: OperationPayload<TOperationReturn> | ((models: TModels) => OperationPayload<TOperationReturn>);
}

export type OperationPayloadTuple<
  TOperationState extends readonly string[],
  TOperationReturn,
  TModels
> = {
  [I in keyof TOperationState]: OperationStateObject<TOperationState[I], TOperationReturn, TModels>
} & { length: TOperationState['length'] };

export type OperationStatePayload<
  TMockOperation extends OperationType<any, any>[keyof TMockOperation],
  TOperationState extends string,
  TModels = any
> = Required<
  Record<
    TOperationState,
    OperationPayload<ReturnType<TMockOperation>, TModels>
  >
>;

type CreateOperationReturnType<
  TMockOperation extends OperationType<any, any>[keyof TMockOperation],
  TOperationState extends string,
  TModels = any
> = {
  defaultState: TOperationState,
  resolver:
    | ((...args: Parameters<TMockOperation>) => OperationStatePayload<TMockOperation, TOperationState, TModels>)
    | OperationStatePayload<TMockOperation, TOperationState, TModels>
}

export type CreateOperationState<
  TMockOperation extends OperationType<any, any>[keyof TMockOperation],
  TOperationState extends string,
  TModels = any
> = CreateOperationReturnType<TMockOperation, TOperationState, TModels>
