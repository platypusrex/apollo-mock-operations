import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('createUser', (_, { input: { name, email } }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) =>
      user.create({
        data: {
          id: String(user.models.length + 1),
          name,
          email,
          address: null,
        },
      }),
  },
]);
