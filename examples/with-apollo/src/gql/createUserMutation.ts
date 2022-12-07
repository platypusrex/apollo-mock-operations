import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const createUserMutation = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...User
    }
  }
  ${userFragment}
`;
