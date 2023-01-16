import { MockGQLOperations } from '@apollo-mock-operations/core';
import { State, Models } from './types';
import introspectionResult from './introspection.json';

export interface MockGQLOperationsType {
  state: State;
  models: Models;
}

export const mockInstance = new MockGQLOperations<MockGQLOperationsType>({
  introspectionResult,
  defaultOperationState: 'SUCCESS',
  enableDevTools: process.env.NEXT_PUBLIC_MOCK_OPERATIONS === 'enabled',
});
