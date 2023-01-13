import { GraphQLError } from 'graphql';
import { mockInstance } from '../builder';

mockInstance.query('book', (_, { id }) => ({
  LOADING: { variant: 'loading' },
  SUCCESS: {
    variant: 'data',
    data: ({ book }) => book.findOne({ where: { id } }),
  },
  EMPTY: {
    variant: 'data',
    data: null,
  },
  NETWORK_ERROR: {
    variant: 'network-error',
    error: new Error('failed with 500'),
  },
  GQL_ERROR: {
    variant: 'graphql-error',
    error: new GraphQLError('failed with 404', { extensions: { code: 'ERROR_CODE' } }),
  },
}));
