import { MockGQLOperations } from '@apollo-mock-operations/core';
import introspectionResult from './introspection.json';

export const mockBuilder = new MockGQLOperations<
  MockOperations,
  OperationModels
>({
  introspectionResult,
  defaultOperationState: 'SUCCESS',
  enableDevTools: import.meta.env.VITE_MOCK_OPERATION === 'enabled',
});

