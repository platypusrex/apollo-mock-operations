import gql from 'gql-tag';

export const bookFragment = gql`
  fragment Book on Book {
    id
    title
    numPages
    authorId
  }
`;
