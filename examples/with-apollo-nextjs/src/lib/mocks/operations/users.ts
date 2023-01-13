import { GraphQLError } from 'graphql';
import { mockInstance } from '../builder';

mockInstance.query('users', {
  LOADING: { variant: 'loading' },
  SUCCESS: {
    variant: 'data',
    data: ({ user }) => user.models,
  },
  NETWORK_ERROR: {
    variant: 'network-error',
    error: new Error('Server responded with 500'),
  },
  GQL_ERROR: {
    variant: 'graphql-error',
    error: new GraphQLError('Server responded with 403'),
  },
});
