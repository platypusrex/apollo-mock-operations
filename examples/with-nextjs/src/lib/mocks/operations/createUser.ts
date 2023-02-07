import { GraphQLError } from 'graphql';
import { generateUUID } from '../generateUUID';
import { mockInstance } from '../builder';

mockInstance.mutation('createUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { input: { name, email } }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ user }) => {
        if (!name || !email) {
          throw new GraphQLError(`Email and name are required`, {
            extensions: { code: 'BAD_USER_INPUT' },
          });
        }

        return user.create({
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
        extensions: { code: 'FORBIDDEN' },
      }),
    },
  }),
});
