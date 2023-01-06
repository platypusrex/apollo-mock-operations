import { mockInstance } from '../builder';

mockInstance.query('booksByAuthorId', (_, { authorId }) => [
  {
    state: 'SUCCESS',
    payload: ({ book }) => ({
      variant: 'data',
      data: book.models.filter((book) => book.authorId === authorId),
    }),
  },
]);
