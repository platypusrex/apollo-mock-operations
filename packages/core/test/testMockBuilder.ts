import { GraphQLError } from 'graphql';
import { MockGQLOperations } from '../src';
import introspectionResult from './introspection.json';
import { MockOperations, OperationModels } from './testTypes';

const builder = new MockGQLOperations<MockOperations, OperationModels>({
  introspectionResult,
});

builder.mutation('createUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { input }) => ({
    GQL_ERROR: { variant: 'graphql-error', error: new GraphQLError('You broke it.') },
    SUCCESS: {
      variant: 'data',
      data: ({ User }) =>
        User.create({
          data: {
            id: (User.models.length + 1).toString(),
            name: input.name,
            email: input.email,
          },
        }),
    },
  }),
});

builder.query('user', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => {
        if ('foo' === 'foo') {
          throw new GraphQLError('boom');
        }
        return User.findOne({ where: { id } });
      },
    },
    GQL_ERROR: {
      variant: 'network-error',
      error: ({ User }) => new Error(`${User.models[0].name} not found`),
    },
    NETWORK_ERROR: { variant: 'network-error' },
    EMPTY: { variant: 'data', data: null },
  }),
});

builder.query('book', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ Book }) => Book.findOne({ where: { id } }),
    },
    EMPTY: { variant: 'data', data: null },
    GQL_ERROR: { variant: 'graphql-error' },
    NETWORK_ERROR: { variant: 'network-error' },
    LOADING: { variant: 'loading' },
  }),
});

builder.query('user', {
  defaultState: 'SUCCESS',
  resolver: () => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => User.models[0],
    },
    GQL_ERROR: { variant: 'graphql-error' },
    NETWORK_ERROR: { variant: 'network-error' },
    EMPTY: { variant: 'data', data: null },
  }),
});
