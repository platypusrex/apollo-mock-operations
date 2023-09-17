import gql from 'gql-tag';
import { userFragment } from './userFragment';

export const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!, $includeAddress: Boolean = true) {
    createUser(input: $input) {
      ...User
    }
  }
  ${userFragment}
`;
