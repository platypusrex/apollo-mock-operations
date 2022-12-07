import { gql } from '@apollo/client';
import { bookFragment } from './bookFragment';

export const booksQuery = gql`
  query Books {
    books {
      ...Book
    }
  }
  ${bookFragment}
`;
