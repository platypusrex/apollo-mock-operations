import { QueryHookOptions, useQuery } from '@apollo/client';
import { usersQuery } from '../gql';

type UseUsersOptions = QueryHookOptions<UsersQuery, UsersQueryVariables>;

export type UseUsers = CustomQueryResult<UsersQuery, UsersQueryVariables> & {
  users?: UserFragment[];
};

export const useUsers = (options: UseUsersOptions = {}): UseUsers => {
  const { data, ...rest } = useQuery<UsersQuery, UsersQueryVariables>(usersQuery, options);
  return { users: data?.users ?? [], ...rest };
};
