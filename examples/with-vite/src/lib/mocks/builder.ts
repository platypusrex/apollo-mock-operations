import { MockGQLOperations } from '@apollo-mock-operations/core';
import introspectionResult from './introspection.json';
import { MockOperations, OperationModels } from '../../typings/generated';

export const mockBuilder = new MockGQLOperations<
  MockOperations,
  OperationModels
>({
  introspectionResult,
  enableDevTools: import.meta.env.VITE_MOCK_OPERATION === 'enabled',
});

