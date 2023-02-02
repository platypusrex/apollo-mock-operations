import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('user', (_, { id }) => ({
  SUCCESS: {
    variant: 'data',
    data: ({ user }) => user.findOne({ where: { id }}),
  },
  EMPTY: {
    variant: 'data',
    data: null,
  },
  NETWORK_ERROR: {
    variant: 'network-error',
    error: new Error('Server responded with 500'),
  },
  GQL_ERROR: {
    variant: 'graphql-error',
    error: new GraphQLError('Server responded with 404')
  }
}));
