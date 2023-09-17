import { MockGQLOperations } from '@apollo-mock-operations/core';
import { MockOperations, OperationModels } from '../gql/graphql';
import introspectionResult from './introspection.json';

export const mockInstance = new MockGQLOperations<MockOperations, OperationModels>({
  introspectionResult,
});
