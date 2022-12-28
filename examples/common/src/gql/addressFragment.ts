import { gql } from '@apollo/client';

export const addressFragment = gql`
  fragment Address on Address {
    addressLineOne
    city
    state
    zip
  }
`;
