import { GraphQLError } from 'graphql';
import { generateUUID } from '../generateUUID';
import { mockInstance } from '../builder';

mockInstance.mutation('createUser', (_, { input: { name, email } }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => {
      if (!name || !email) {
        return {
          variant: 'graphql-error',
          error: new GraphQLError(`Email and name are required`, {
            extensions: { code: 'USER_INPUT_ERR' },
          }),
        };
      }

      return {
        variant: 'data',
        data: user.create({
          data: {
            id: generateUUID(),
            name,
            email,
            address: null,
          },
        }),
      };
    },
  },
  {
    state: 'GQL_ERROR',
    payload: {
      variant: 'graphql-error',
      error: new GraphQLError('Error creating user', {
        extensions: { code: 'FORBIDDEN' },
      }),
    },
  },
]);
