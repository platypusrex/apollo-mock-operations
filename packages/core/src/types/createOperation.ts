import { GraphQLError } from 'graphql';
import type { GraphqlError, NetworkError, OperationLoading, OperationType } from './shared';

type ResultType = 'graphql-error' | 'network-error' | 'loading' | 'data';

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
