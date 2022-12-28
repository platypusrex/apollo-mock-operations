import { GraphQLError } from 'graphql';
import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('createUser', (_, { input: { name, email } }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => {
      if (!name || !email) {
        return {
          graphQLError: new GraphQLError(`Email and name are required`, {
            extensions: { code: 'FUCK_STICK' },
          }),
        };
      }

      return user.create({
        data: {
          id: String(user.models.length + 1),
          name,
          email,
          address: null,
        },
      });
    },
  },
  {
    state: 'GQL_ERROR',
    result: {
      graphQLError: new GraphQLError('Error creating user', { extensions: { code: 'FUCK_STICK' } }),
    },
  },
]);
