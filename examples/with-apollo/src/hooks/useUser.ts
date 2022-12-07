import { QueryHookOptions, useQuery } from '@apollo/client';
import { userQuery } from '../gql';

type UseUserOptions = QueryHookOptions<UserQuery, UserQueryVariables>;

export type UseUser = CustomQueryResult<UserQuery, UserQueryVariables> & {
  user?: UserFragment | null;
};

export const useUser = (options: UseUserOptions = {}): UseUser => {
  const { data, ...rest } = useQuery<UserQuery, UserQueryVariables>(userQuery, options);
  return { user: data?.user, ...rest };
};
