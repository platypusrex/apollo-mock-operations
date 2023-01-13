import { mockBuilder } from '../builder';

mockBuilder.mutation('deleteUser', (_, { id }) => ({
  SUCCESS: {
    variant: 'data',
    data: ({ user }) => user.delete({ where: { id } }),
  },
}));
