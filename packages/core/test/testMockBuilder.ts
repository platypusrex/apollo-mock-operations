import { MockGQLOperations, OperationModelType, OperationState } from '../src';
import introspectionResult from './introspection.json';
import { UserMockOperation, BookMockOperation } from './testTypes';

type MockOperationsState = {
  state:
    OperationState<UserMockOperation, ['SUCCESS', 'NETWORK_ERROR']> &
    OperationState<BookMockOperation, ['SUCCESS', 'GQL_ERROR', 'NETWORK_ERROR']>;
  models:
    OperationModelType<UserMockOperation> &
    OperationModelType<BookMockOperation>;
}

const mockBuilder = new MockGQLOperations<MockOperationsState>({
  introspectionResult
});

mockBuilder.queryOperation('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => ({
      variant: 'data',
      data: user.findOne({ where: { id } })
    })
  },
  {
    state: 'NETWORK_ERROR',
    result: {
      variant: 'network-error',
      error: new Error('custom network error message')
    }
  },
])

mockBuilder.queryOperation('book', [
  {
    state: 'SUCCESS',
    result: ({ book }) => ({
      variant: 'data',
      data: book.findOne({ where: { id: '1' }})
    })
  },
  {
    state: 'GQL_ERROR',
    result: {
      variant: 'graphql-error',
    },
  },
  {
    state: 'NETWORK_ERROR',
    result: {
      variant: 'network-error',
    },
  },
])
