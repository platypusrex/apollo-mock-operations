import { MockGQLOperations } from '@apollo-mock-operations/core';
import introspectionResult from './introspection.json';

export const mockInstance = new MockGQLOperations<MockOperations, OperationModels>({
  introspectionResult,
  defaultOperationState: 'SUCCESS',
  enableDevTools: process.env.NEXT_PUBLIC_MOCK_OPERATIONS === 'enabled',
});
