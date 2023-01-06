import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.findOne({ where: { id } })
    }),
  },
  {
    state: 'EMPTY',
    payload: {
      variant: 'data',
      data: null,
    },
  },
  {
    state: 'NETWORK_ERROR',
    payload: {
      variant: 'network-error',
      error: new Error('Server responded with 500')
    },
  },
  {
    state: 'GQL_ERROR',
    payload: {
      variant: 'graphql-error',
      error: new GraphQLError('Server responded with 404')
    },
  },
]);
