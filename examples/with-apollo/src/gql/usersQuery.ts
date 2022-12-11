import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const usersQuery = gql`
  query Users($includeAddress: Boolean = true) {
    users {
      ...User
    }
  }
  ${userFragment}
`;
