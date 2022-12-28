import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('book', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => book.findOne({ where: { id } }),
  },
  {
    state: 'SUCCESS',
    result: {
      id,
      title: 'My title',
      numPages: 125,
      authorId: '1',
      loading: 'fucking a'
    }
  },
  {
    state: 'EMPTY',
    result: null,
  },
  {
    state: 'NETWORK_ERROR',
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
