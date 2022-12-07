import { BaseMutationOptions, MutationResult, useMutation } from '@apollo/client';
import { deleteUserMutation } from '../gql';

type UseDeleteUserOptions = BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;

type UseDeleteUser = MutationResult<DeleteUserMutation> & {
  deleteUser: MutationFn<DeleteUserMutation, DeleteUserMutationVariables>;
};

export const useDeleteUser = (options: UseDeleteUserOptions = {}): UseDeleteUser => {
  const [deleteUser, rest] = useMutation<DeleteUserMutation, DeleteUserMutationVariables>(
    deleteUserMutation,
    options
  );
  return { deleteUser, ...rest };
};
