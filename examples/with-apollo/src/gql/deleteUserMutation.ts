import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const deleteUserMutation = gql`
  mutation DeleteUser($id: ID!, $includeAddress: Boolean = true) {
    deleteUser(id: $id) {
      ...User
    }
  }
  ${userFragment}
`;
