type BaseOperation = Record<string, any> & {
  __typename?: 'Query' | 'Mutation';
};

type OperationState<TOperation extends BaseOperation = BaseOperation> = Partial<
  Omit<Record<keyof TOperation, string[]>, '__typename'>
>;

export type OperationStateConfig<
  TQuery extends BaseOperation = BaseOperation,
  TMutation extends BaseOperation = BaseOperation,
> = {
  operationState: OperationState<TQuery> & OperationState<TMutation>;
};
