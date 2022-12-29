import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('createUser', (_, { input: { name, email } }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => {
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
            id: String(user.models.length + 1),
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
    result: {
      variant: 'graphql-error',
      error: new GraphQLError('Error creating user', {
        extensions: { code: 'FORBIDDEN' }
      }),
    },
  },
]);
