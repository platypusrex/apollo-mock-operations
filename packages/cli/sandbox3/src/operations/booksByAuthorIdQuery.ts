import gql from 'gql-tag';
import { bookFragment } from './bookFragment';

export const booksByAuthorIdQuery = gql`
  query BooksByAuthorId($authorId: ID!) {
    booksByAuthorId(authorId: $authorId) {
      ...Book
    }
  }
  ${bookFragment}
`;
