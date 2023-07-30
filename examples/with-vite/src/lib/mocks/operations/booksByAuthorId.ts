import { mockBuilder } from '../builder';

mockBuilder.query('booksByAuthorId', {
  defaultState: 'SUCCESS',
  resolver: (_, { authorId }) => ({
    SUCCESS: {
      variant: 'data',
      data: ({ Book }) => Book.models.filter((book) => book.authorId === authorId),
    },
  })
})
