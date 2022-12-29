import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('deleteUser', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => ({
      variant: 'data',
      data: user.delete({ where: { id } }),
    }),
  },
]);
