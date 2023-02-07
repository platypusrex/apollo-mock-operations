import { MockGQLOperations } from '@apollo-mock-operations/core';
import introspectionResult from './introspection.json';
import { State, Models } from './types';

export interface MockGQLOperationsType {
  state: State;
  models: Models;
}

export const mockBuilder = new MockGQLOperations<MockGQLOperationsType>({
  introspectionResult,
  defaultOperationState: 'SUCCESS',
  enableDevTools: import.meta.env.VITE_MOCK_OPERATION === 'enabled',
});

