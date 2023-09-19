import { MockGQLOperations } from '@apollo-mock-operations/core';
import { MockOperations, OperationModels } from '<operation-type-path>';
import introspectionResult from '<introspection-path>';

export const mockBuilder = new MockGQLOperations<MockOperations, OperationModels>({
  introspectionResult,
});
