import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('users', [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.models,
  },
  {
    state: 'LOADING',
    result: { loading: true },
  },
  {
    state: 'ERROR',
    result: { networkError: new Error('Server responded with 500') },
  },
  {
    state: 'GQL_ERROR',
    result: { graphQLError: new GraphQLError('Server responded with 403') },
  },
]);
