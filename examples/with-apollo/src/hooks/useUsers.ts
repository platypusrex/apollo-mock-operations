import { useQuery } from '@apollo/client';
import { usersQuery } from '../gql';

export type UseUsers = CustomQueryResult<UsersQuery, UsersQueryVariables> & {
  users?: UserFragment[];
};

export const useUsers = (): UseUsers => {
  const { data, ...rest } = useQuery<UsersQuery, UsersQueryVariables>(usersQuery);
  return { users: data?.users ?? [], ...rest };
};
