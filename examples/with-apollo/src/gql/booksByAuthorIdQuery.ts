import { gql } from '@apollo/client';
import { bookFragment } from './bookFragment';

export const booksByAuthorIdQuery = gql`
  query BooksByAuthorId($authorId: ID!) {
    booksByAuthorId(authorId: $authorId) {
      ...Book
    }
  }
  ${bookFragment}
`;
