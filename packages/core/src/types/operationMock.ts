import { IntrospectionQuery } from 'graphql';
import { OperationModel } from '../OperationModel';
import { AnyObject } from './util';
import { CreateOperationState } from './createOperation';
import { OperationFn, OperationState } from './shared';

export interface MockGQLOperationsCreate<TQueryOperations, TMutationOperations> {
  Query: TQueryOperations;
  Mutation?: TMutationOperations;
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
      TMockGQLOperations['state']['operation'][keyof TMockGQLOperations['state']['operation']],
      TMockGQLOperations['state']['state'][keyof TMockGQLOperations['state']['state']],
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
  defaultOperationState?: string;
  enableDevTools?: boolean;
}

export interface MockGQLOperationsType<
  TOperationState extends Record<'state', OperationState<any, string>>,
  TModels extends Record<'models', OperationModel<any>>
> {
  state: TOperationState;
  models?: TModels;
}
