import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('users', [
  {
    state: 'SUCCESS',
    result: ({ user }) => ({
      variant: 'data',
      data: user.models,
    }),
  },
  {
    state: 'LOADING',
    result: { variant: 'loading' },
  },
  {
    state: 'NETWORK_ERROR',
    result: { variant: 'network-error', error: new Error('Server responded with 500') },
  },
  {
    state: 'GQL_ERROR',
    result: { variant: 'graphql-error', error: new GraphQLError('Server responded with 403') },
  },
]);
