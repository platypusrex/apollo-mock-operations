import { BaseMutationOptions, MutationResult, useMutation } from '@apollo/client';
import { createUserMutation } from '../gql';
import { CreateUserMutation, CreateUserMutationVariables } from '../typings/generated';

type UseCreateUserOptions = BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;

type UseCreateUser = MutationResult<CreateUserMutation> & {
  createUser: MutationFn<CreateUserMutation, CreateUserMutationVariables>;
};

export const useCreateUser = (options: UseCreateUserOptions = {}): UseCreateUser => {
  const [createUser, rest] = useMutation<CreateUserMutation, CreateUserMutationVariables>(
    createUserMutation,
    options
  );
  return { createUser, ...rest };
};
