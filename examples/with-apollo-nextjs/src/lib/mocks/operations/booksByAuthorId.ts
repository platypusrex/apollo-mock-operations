import { mockInstance } from '../builder';

mockInstance.query('booksByAuthorId', (_, { authorId }) => ({
  SUCCESS: {
    variant: 'data',
    data: ({ book }) => book.models.filter((book) => book.authorId === authorId),
  },
}));
