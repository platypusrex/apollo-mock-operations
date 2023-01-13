import type { AnyObject } from './util';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

// object that include info on any given graphQL operation
export interface OperationMeta {
  query: string;
  operationName: string;
  variables: { [key: string]: any };
  result: { [key: string]: any };
}

// shared type that describe shape of any mocked operation state object
export interface OperationState<
  TMockOperation extends OperationType<any, any>,
  TOperationState extends string
> {
  operation: TMockOperation;
  state: Record<keyof TMockOperation, TOperationState>;
}

// shared type that describes the expected shape of a mocked operation
export type OperationType<TResult, TArgs> = Record<
  keyof TResult,
  ResolverFn<TResult[keyof TResult], AnyObject, AnyObject, TArgs>
>;

// shared type that describes the final type of any stateful mocked operation function
export type OperationFn<TState, TResult, TArgs> = (
  scenario: TState
) => OperationType<TResult, TArgs>;

// shared type that describes the shape of graphQL resolver for mocking operations
export type GraphqlError = { graphQLError?: GraphQLError };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphqlError | NetworkError | OperationLoading;
