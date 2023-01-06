import { mockInstance } from '../builder';

mockInstance.mutation('deleteUser', (_, { id }) => [
  {
    state: 'SUCCESS',
    payload: ({ user }) => ({
      variant: 'data',
      data: user.delete({ where: { id } }),
    }),
  },
]);
