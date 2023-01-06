import { MockGQLOperations, OperationModelType, OperationState } from '../src';
import introspectionResult from './introspection.json';
import { UserMockOperation, BookMockOperation } from './testTypes';

type MockOperationsState = {
  state: OperationState<UserMockOperation, ['SUCCESS', 'NETWORK_ERROR']> &
    OperationState<BookMockOperation, ['SUCCESS', 'GQL_ERROR', 'NETWORK_ERROR']>;
  models: OperationModelType<UserMockOperation> & OperationModelType<BookMockOperation>;
};

const mockBuilder = new MockGQLOperations<MockOperationsState>({
  introspectionResult,
});

mockBuilder.query('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.findOne({ where: { id } }),
    }),
  },
  {
    state: 'NETWORK_ERROR',
    payload: {
      variant: 'network-error',
      error: new Error('custom network error message'),
    },
  },
]);

mockBuilder.query('book', [
  {
    state: 'SUCCESS',
    payload: ({ book }) => ({
      variant: 'data',
      data: book.findOne({ where: { id: '1' } }),
    }),
  },
  {
    state: 'GQL_ERROR',
    payload: {
      variant: 'graphql-error',
    },
  },
  {
    state: 'NETWORK_ERROR',
    payload: {
      variant: 'network-error',
    },
  },
]);