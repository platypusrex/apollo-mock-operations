import { mockInstance } from '../builder';

mockInstance.mutation('deleteUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ user }) => user.delete({ where: { id } }),
    },
  }),
});
