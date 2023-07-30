import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.query('user', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => User.findOne({ where: { id }}),
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
  })
})
