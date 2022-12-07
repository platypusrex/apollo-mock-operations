import { useQuery } from '@apollo/client';
import { booksQuery } from '../gql';

export type UseBooks = CustomQueryResult<BooksQuery, BooksQueryVariables> & {
  books?: BookFragment[];
};

export const useBook = (): UseBooks => {
  const { data, ...rest } = useQuery<BooksQuery, BooksQueryVariables>(booksQuery);
  return { books: data?.books, ...rest };
};
