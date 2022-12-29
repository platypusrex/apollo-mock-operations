import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => ({
      variant: 'data',
      data: user.findOne({ where: { id } }),
    }),
  },
  {
    state: 'EMPTY',
    result: { variant: 'data', data: null },
  },
  {
    state: 'NETWORK_ERROR',
    result: { variant: 'network-error', error: new Error('Server responded with 500') },
  },
  {
    state: 'GQL_ERROR',
    result: { variant: 'graphql-error', error: new GraphQLError('Server responded with 404') },
  },
]);
