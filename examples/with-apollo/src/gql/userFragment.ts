import { gql } from '@apollo/client';
import { addressFragment } from './addressFragment';

export const userFragment = gql`
  fragment User on User {
    id
    name
    email
    address {
      ...Address
    }
  }
  ${addressFragment}
`;
