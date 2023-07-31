import type { IntrospectionQuery } from 'graphql';
import type { AnyObject } from './util';
import type { CreateOperationState } from './createOperation';
import type { OperationFn, ResolverFn /*OperationState*/ } from './shared';

export type MockGQLOperationsCreate<TQueryOperations, TMutationOperations> = {
  Query: TQueryOperations;
  Mutation?: TMutationOperations;
};

export type MockGQLOperationType<TMockOperationsType extends MockGQLOperationsType> = {
  operations?: {
    query: OperationFn<TMockOperationsType['Query']['state'], AnyObject, AnyObject>[];
    mutation?: OperationFn<TMockOperationsType['Mutation']['state'], AnyObject, AnyObject>[];
  };
};

export type MockGQLOperationMap<TMockGQLOperations extends MockGQLOperationsType> = {
  query: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['Query'][keyof TMockGQLOperations['Query']]['resolver'],
      TMockGQLOperations['Query'][keyof TMockGQLOperations['Query']]['state'],
      keyof TMockGQLOperations['Query']
    >
  >[];
  mutation: Record<
    string,
    CreateOperationState<
      TMockGQLOperations['Mutation'][keyof TMockGQLOperations['Mutation']]['resolver'],
      TMockGQLOperations['Mutation'][keyof TMockGQLOperations['Mutation']]['state'],
      keyof TMockGQLOperations['Mutation']
    >
  >[];
};

export type MockGQLOperationsConfig = {
  introspectionResult: IntrospectionQuery | any;
  enableDevTools?: boolean;
};

export type MockRootOperationsType = Record<
  string,
  {
    type: 'Query' | 'Mutation';
    resolver: ResolverFn<any, any, any, any>;
    state: string;
  }
>;

export type MockGQLOperationsType = {
  Query: MockRootOperationsType;
  Mutation: MockRootOperationsType;
};

export type MockModelsType = Record<string, { [key: string]: any }>
