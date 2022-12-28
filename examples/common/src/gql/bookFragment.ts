import { gql } from '@apollo/client';

export const bookFragment = gql`
  fragment Book on Book {
    id
    title
    numPages
    authorId
  }
`;
