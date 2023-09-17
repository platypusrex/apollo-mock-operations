import gql from 'gql-tag';

export const addressFragment = gql`
  fragment Address on Address {
    addressLineOne
    city
    state
    zip
  }
`;
