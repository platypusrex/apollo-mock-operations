import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';
import { generateUUID } from '../generateUUID';

mockBuilder.mutation('createUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { input: { name, email } }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => {
        if (!name || !email) {
          new GraphQLError(`Email and name are required`, {
            extensions: { code: 'BAD_USER_INPUT' },
          })
        }

        return User.create({
          data: {
            id: generateUUID(),
            name,
            email,
            address: null,
          },
        });
      },
    },
    GQL_ERROR: {
      variant: 'graphql-error',
      error: new GraphQLError('Error creating user', {
        extensions: { code: 'FORBIDDEN' }
      }),
    },
  })
})
