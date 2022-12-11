import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!, $includeAddress: Boolean = true) {
    createUser(input: $input) {
      ...User
    }
  }
  ${userFragment}
`;
