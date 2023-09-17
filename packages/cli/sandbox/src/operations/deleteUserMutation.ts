import gql from 'gql-tag';
import { userFragment } from './userFragment';

export const deleteUserMutation = gql`
  mutation DeleteUser($id: ID!, $includeAddress: Boolean = true) {
    deleteUser(id: $id) {
      ...User
    }
  }
  ${userFragment}
`;
