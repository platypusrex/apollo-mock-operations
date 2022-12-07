import { QueryHookOptions, useQuery } from '@apollo/client';
import { booksByAuthorIdQuery } from '../gql';

type UseBooksByAuthorOptions = QueryHookOptions<
  BooksByAuthorIdQuery,
  BooksByAuthorIdQueryVariables
>;

export type UseBooksByAuthor = CustomQueryResult<
  BooksByAuthorIdQuery,
  BooksByAuthorIdQueryVariables
> & {
  books?: BookFragment[];
};

export const useBooksByAuthor = (options: UseBooksByAuthorOptions = {}): UseBooksByAuthor => {
  const { data, ...rest } = useQuery<BooksByAuthorIdQuery, BooksByAuthorIdQueryVariables>(
    booksByAuthorIdQuery,
    options
  );
  return { books: data?.booksByAuthorId ?? [], ...rest };
};
