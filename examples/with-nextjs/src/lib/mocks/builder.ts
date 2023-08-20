import { MockGQLOperations } from '@apollo-mock-operations/core';
import { MockOperations, OperationModels } from '../../typings/generated';
import introspectionResult from './introspection.json';

export const mockInstance = new MockGQLOperations<MockOperations, OperationModels>({
  introspectionResult,
  enableDevTools: process.env.NEXT_PUBLIC_MOCK_OPERATIONS === 'enabled',
});
