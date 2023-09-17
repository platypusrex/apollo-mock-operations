import { MockGQLOperations } from '@apollo-mock-operations/core';
import introspectionResult from '<introspection-path>';

export const mockBuilder = new MockGQLOperations({
  introspectionResult,
});
