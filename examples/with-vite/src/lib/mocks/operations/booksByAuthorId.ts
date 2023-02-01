import { mockBuilder } from '../builder';

mockBuilder.query('booksByAuthorId', (_, { authorId }) => ({
  SUCCESS: {
    variant: 'data',
    data: ({ book }) => book.models.filter((book) => book.authorId === authorId),
  },
}));
