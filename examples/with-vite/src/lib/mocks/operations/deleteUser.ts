import { mockBuilder } from '../builder';

mockBuilder.mutation('deleteUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ user }) => user.delete({ where: { id } }),
    },
  })
})
