import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('book', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    LOADING: { variant: 'loading' },
    SUCCESS: {
      variant: 'data',
      data: ({ Book }) => Book.findOne({ where: { id } })
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
  })
})
