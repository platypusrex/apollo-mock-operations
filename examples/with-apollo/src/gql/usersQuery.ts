import { gql } from '@apollo/client';
import { userFragment } from './userFragment';

export const usersQuery = gql`
  query Users {
    users {
      ...User
    }
  }
  ${userFragment}
`;
