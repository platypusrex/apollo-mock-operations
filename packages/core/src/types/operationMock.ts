import { AnyObject } from './util';
import { IntrospectionQuery } from 'graphql/index';
import { OperationModel } from '../OperationModel';
import { OperationFn, OperationState } from './shared';
import { CreateOperationState } from './createOperation';

export interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation: TMutationOperations;
}

export interface MockGQLOperationType<TOperationState> {
  operations?: {
    query: OperationFn<TOperationState, AnyObject, AnyObject>[];
    mutation?: OperationFn<TOperationState, AnyObject, AnyObject>[];
  };
}

export interface MockGQLOperationMap<TMockGQLOperations extends MockGQLOperationsType<any, any>> {
  query: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['state']['operation'][string],
      TMockGQLOperations['state']['state'][string],
      TMockGQLOperations['models']
    >
  >[];
  mutation: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['state']['operation'][string],
      TMockGQLOperations['state']['state'][string],
      TMockGQLOperations['models']
    >
  >[];
}

export interface MockGQLOperationsConfig {
  introspectionResult: IntrospectionQuery | any;
  defaultOperationState: string;
  enableDevTools?: boolean;
}

export interface MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, string>>,
  TModels extends Record<'models', OperationModel<any>>
> {
  state: TOperationState;
  models?: TModels;
}
