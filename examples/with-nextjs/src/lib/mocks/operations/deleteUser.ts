import { mockInstance } from '../builder';

mockInstance.mutation('deleteUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => User.delete({ where: { id } }),
    },
  }),
});
