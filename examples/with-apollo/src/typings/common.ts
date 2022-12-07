import {
  FetchResult,
  MutationFunctionOptions,
  OperationVariables,
  QueryResult,
} from '@apollo/client';

declare global {
  type CustomQueryResult<TData, TVariables = OperationVariables> = Omit<
    QueryResult<TData, TVariables>,
    'data'
  >;

  type MutationFn<TData, TVariables> = (
    options: MutationFunctionOptions<TData, TVariables>
  ) => Promise<FetchResult<TData>>;
}
