import { mockBuilder } from '../builder';

mockBuilder.mutation('deleteUser', (_, { id }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.delete({ where: { id } }),
    }),
  },
]);
