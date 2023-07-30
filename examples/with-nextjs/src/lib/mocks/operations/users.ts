import { GraphQLError } from 'graphql';
import { mockInstance } from '../builder';

mockInstance.query('users', {
  defaultState: 'SUCCESS',
  resolver: {
    LOADING: { variant: 'loading' },
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => User.models,
    },
    NETWORK_ERROR: {
      variant: 'network-error',
      error: new Error('Server responded with 500'),
    },
    GQL_ERROR: {
      variant: 'graphql-error',
      error: new GraphQLError('Server responded with 403'),
    },
  },
});
