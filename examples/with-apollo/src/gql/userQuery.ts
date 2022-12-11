import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const userQuery = gql`
  query User($id: ID!, $includeAddress: Boolean = true) {
    user(id: $id) {
      ...User
    }
  }
  ${userFragment}
`;
