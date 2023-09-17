import gql from 'gql-tag';
import { userFragment } from './userFragment';

export const userQuery = gql`
  query User($id: ID!, $includeAddress: Boolean = true) {
    user(id: $id) {
      ...User
    }
  }
  ${userFragment}
`;
