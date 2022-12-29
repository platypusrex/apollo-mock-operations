import { mockBuilder } from '../builder';

mockBuilder.queryOperation('booksByAuthorId', (_, { authorId }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => ({
      variant: 'data',
      data: book.models.filter((book) => book.authorId === authorId)
    }),
  },
]);
