import { GraphQLError } from 'graphql';
import { MockGQLOperations, OperationModelType, OperationState } from '../src';
import { UserMockOperation, BookMockOperation } from './testTypes';
import introspectionResult from './introspection.json';

type MockOperationsState = {
  state: OperationState<UserMockOperation, 'SUCCESS' | 'GQL_ERROR'> &
    OperationState<BookMockOperation, 'SUCCESS' | 'GQL_ERROR' | 'NETWORK_ERROR'>;
  models: OperationModelType<UserMockOperation> & OperationModelType<BookMockOperation>;
};

const mockBuilder = new MockGQLOperations<MockOperationsState>({
  introspectionResult,
  defaultOperationState: 'SUCCESS',
});

mockBuilder.query('user', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ user }) => {
        if ('foo' === 'foo') {
          throw new GraphQLError('boom');
        }
        return user.findOne({ where: { id } });
      },
    },
    GQL_ERROR: {
      variant: 'network-error',
      error: ({ user }) => new Error(`${user.models[0].name} not found`),
    },
  }),
});

mockBuilder.query('book', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ book }) => book.findOne({ where: { id } }),
    },
    GQL_ERROR: { variant: 'graphql-error' },
    NETWORK_ERROR: { variant: 'network-error' },
  }),
});

mockBuilder.query('user', {
  defaultState: 'SUCCESS',
  resolver: () => ({
    SUCCESS: {
      variant: 'data',
      data: ({ user }) => user.models[0],
    },
    GQL_ERROR: {
      variant: 'graphql-error',
    },
  }),
});
