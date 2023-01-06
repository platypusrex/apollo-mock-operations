import { mockBuilder } from '../builder';

mockBuilder.query('booksByAuthorId', (_, { authorId }) => [
  {
    state: 'SUCCESS',
    payload: ({ book }) => ({
      variant: 'data',
      data: book.models.filter((book) => book.authorId === authorId)
    }),
  },
]);
