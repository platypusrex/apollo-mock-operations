import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('users', [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.models,
    }),
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
      error: new GraphQLError('Server responded with 403')
    },
  },
  {
    state: 'LOADING',
    payload: { variant: 'loading' },
  },
]);
