import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('book', (_, { id }) => [
  {
    state: 'SUCCESS',
    payload: ({ book }) => ({
      variant: 'data',
      data: book.findOne({ where: { id } }),
    }),
  },
  {
    state: 'EMPTY',
    payload: {
      variant: 'data',
      data: null,
    },
  },
  {
    state: 'NETWORK_ERROR',
    payload: { variant: 'network-error', error: new Error('failed with 500') },
  },
  {
    state: 'GQL_ERROR',
    payload: {
      variant: 'graphql-error',
      error: new GraphQLError('failed with 404', { extensions: { code: 'ERROR_CODE' } }),
    },
  },
  {
    state: 'LOADING',
    payload: { variant: 'loading' },
  },
]);
