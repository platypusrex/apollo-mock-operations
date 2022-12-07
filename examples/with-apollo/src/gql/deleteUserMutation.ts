import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const deleteUserMutation = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      ...User
    }
  }
  ${userFragment}
`;
