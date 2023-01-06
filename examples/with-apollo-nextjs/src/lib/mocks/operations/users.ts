import { GraphQLError } from 'graphql';
import { mockInstance } from '../builder';

mockInstance.query('users', [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.models,
    }),
  },
  {
    state: 'LOADING',
    payload: { variant: 'loading' },
  },
  {
    state: 'NETWORK_ERROR',
    payload: { variant: 'network-error', error: new Error('Server responded with 500') },
  },
  {
    state: 'GQL_ERROR',
    payload: { variant: 'graphql-error', error: new GraphQLError('Server responded with 403') },
  },
]);
