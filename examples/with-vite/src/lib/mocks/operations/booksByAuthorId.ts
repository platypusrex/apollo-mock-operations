import { mockBuilder } from '../builder';

mockBuilder.query('booksByAuthorId', {
  defaultState: 'SUCCESS',
  resolver: (_, { authorId }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ book }) => book.models.filter((book) => book.authorId === authorId),
    },
  })
})
