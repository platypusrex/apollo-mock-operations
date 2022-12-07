import { useQuery } from '@apollo/client';
import { bookQuery } from '../gql';

export type UseBook = CustomQueryResult<BookQuery, BookQueryVariables> & {
  book?: BookFragment | null;
};

export const useBook = (): UseBook => {
  const { data, ...rest } = useQuery<BookQuery, BookQueryVariables>(bookQuery, {
    variables: { id: '1' },
  });
  return { book: data?.book, ...rest };
};
