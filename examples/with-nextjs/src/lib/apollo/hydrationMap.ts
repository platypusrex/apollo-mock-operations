import { QueryOptions } from '@apollo/client';
import { generateHydrationMap } from 'nextjs-apollo-client';
import {
  bookQuery,
  usersQuery,
  userQuery,
  booksByAuthorIdQuery,
  UsersQueryVariables,
  UsersQuery,
  BookQueryVariables,
  BookQuery,
  UserQueryVariables,
  UserQuery,
  BooksByAuthorIdQueryVariables,
  BooksByAuthorIdQuery,
} from '@examples/common';

export const hydrationMap = generateHydrationMap({
  users: (): QueryOptions<UsersQueryVariables, UsersQuery> => ({ query: usersQuery }),
  book: (): QueryOptions<BookQueryVariables, BookQuery> => ({
    query: bookQuery,
    variables: { id: '1' },
  }),
  user: ({ query }): QueryOptions<UserQueryVariables, UserQuery> => ({
    query: userQuery,
    variables: { id: query.id as string },
  }),
  booksByAuthor: ({
    query,
  }): QueryOptions<BooksByAuthorIdQueryVariables, BooksByAuthorIdQuery> => ({
    query: booksByAuthorIdQuery,
    variables: { authorId: query.id as string },
  }),
});
