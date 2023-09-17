import gql from 'gql-tag';
import { userFragment } from './userFragment';

export const usersQuery = gql`
  query Users($includeAddress: Boolean = true) {
    users {
      ...User
    }
  }
  ${userFragment}
`;
