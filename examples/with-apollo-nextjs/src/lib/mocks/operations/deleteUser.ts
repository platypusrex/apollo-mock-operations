import { mockInstance } from '../builder';

mockInstance.mutation('deleteUser', (_, { id }) => ({
  SUCCESS: {
    variant: 'data',
    data: ({ user }) => user.delete({ where: { id } }),
  },
}));
