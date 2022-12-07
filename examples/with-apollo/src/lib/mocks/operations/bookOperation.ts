import { mockBuilder } from '../builder';

mockBuilder.queryOperation('book', (_, { id }) => [
  {
    state: 'SUCCESS',
    result: ({ book }) => book.findOne({ where: { id } }),
  },
  {
    state: 'EMPTY',
    result: null,
  },
  {
    state: 'ERROR',
    result: { networkError: new Error('failed with 404') },
  },
  {
    state: 'LOADING',
    result: { loading: true },
  },
]);
