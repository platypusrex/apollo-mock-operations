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
  enableDevTools: process.env.REACT_APP_MOCK_OPERATIONS === 'enabled',
});
