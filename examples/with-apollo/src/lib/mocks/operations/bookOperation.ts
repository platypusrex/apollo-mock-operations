import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('book', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => book.findOne({ where: { id } }),
  },
  {
    state: 'EMPTY',
    result: null,
  },
  {
    state: 'ERROR',
    result: { networkError: new Error('failed with 500') },
  },
  {
    state: 'GQL_ERROR',
    result: {
      graphQLError: new GraphQLError('failed with 404', { extensions: { code: 'ERROR_CODE' } }),
    },
  },
  {
    state: 'LOADING',
    result: { loading: true },
  },
]);
