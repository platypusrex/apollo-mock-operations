import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.queryOperation('book', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => ({
      variant: 'data',
      data: book.findOne({ where: { id } }),
    }),
  },
  {
    state: 'EMPTY',
    result: {
      variant: 'data',
      data: null,
    },
  },
  {
    state: 'NETWORK_ERROR',
    result: { variant: 'network-error', error: new Error('failed with 500') },
  },
  {
    state: 'GQL_ERROR',
    result: {
      variant: 'graphql-error',
      error: new GraphQLError('failed with 404', { extensions: { code: 'ERROR_CODE' } }),
    },
  },
  {
    state: 'LOADING',
    result: { variant: 'loading' },
  },
]);
