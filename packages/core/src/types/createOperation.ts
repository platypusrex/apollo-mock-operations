import { GraphQLError } from 'graphql';
import type { GraphqlError, NetworkError, OperationLoading, OperationType } from './shared';

type PayloadType = 'graphql-error' | 'network-error' | 'loading' | 'data';

type LoadingPayload = {
  variant: Extract<PayloadType, 'loading'>;
};

type GraphQLErrorPayload = {
  variant: Extract<PayloadType, 'graphql-error'>;
  error?: GraphQLError;
};

type NetworkErrorPayload = {
  variant: Extract<PayloadType, 'network-error'>;
  error?: Error;
};

type DataPayload<T> =
  T extends GraphqlError | NetworkError | OperationLoading
    ? never
    : T extends Promise<infer U>
      ? { variant: Extract<PayloadType, 'data'>; data: U }
      : { variant: Extract<PayloadType, 'data'>; data: T };

export type OperationPayload<T> =
  | LoadingPayload
  | GraphQLErrorPayload
  | NetworkErrorPayload
  | DataPayload<T>;

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
) => OperationPayloadTuple<TOperationState, ReturnType<TMockOperation>, TModels>)
  | OperationPayloadTuple<TOperationState, ReturnType<TMockOperation>, TModels>;
