import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('user', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.findOne({ where: { id } }),
  },
  {
    state: 'EMPTY',
    result: null,
  },
  {
    state: 'NETWORK_ERROR',
    result: { networkError: new Error('Server responded with 500') },
  },
  {
    state: 'ERROR',
    result: { graphQLError: new GraphQLError('Server responded with 404') },
  },
]);
