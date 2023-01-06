import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';
import { generateUUID } from '../generateUUID';

mockBuilder.mutation('createUser', (_, { input: { name, email } }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => {
      if (!name || !email) {
        return {
          variant: 'graphql-error',
          error: new GraphQLError(`Email and name are required`, {
            extensions: { code: 'FUCK_STICK' },
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
        })
      };
    },
  },
  {
    state: 'GQL_ERROR',
    payload: {
      variant: 'graphql-error',
      error: new GraphQLError('Error creating user', {
        extensions: { code: 'FORBIDDEN' }
      }),
    },
  },
]);
