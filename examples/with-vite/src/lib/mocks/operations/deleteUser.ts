import { mockBuilder } from '../builder';

mockBuilder.mutation('deleteUser', {
  defaultState: 'SUCCESS',
  resolver: (_, { id }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ User }) => User.delete({ where: { id } }),
    },
  })
})
