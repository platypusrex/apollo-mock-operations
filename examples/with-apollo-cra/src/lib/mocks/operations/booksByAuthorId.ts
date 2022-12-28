import { mockBuilder } from '../builder';

mockBuilder.queryOperation('booksByAuthorId', (_, { authorId }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => book.models.filter((book) => book.authorId === authorId),
  },
]);
