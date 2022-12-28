import { mockBuilder } from '../builder';

mockBuilder.mutationOperation('deleteUser', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ user }) => user.delete({ where: { id } }),
  },
]);
