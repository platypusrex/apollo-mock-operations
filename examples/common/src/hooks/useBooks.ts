import { useQuery } from '@apollo/client';
import { booksQuery } from '../gql';
import { BookFragment, BooksQuery, BooksQueryVariables } from '../typings/generated';

export type UseBooks = CustomQueryResult<BooksQuery, BooksQueryVariables> & {
  books?: BookFragment[];
};

export const useBooks = (): UseBooks => {
  const { data, ...rest } = useQuery<BooksQuery, BooksQueryVariables>(booksQuery);
  return { books: data?.books, ...rest };
};
