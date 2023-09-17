import gql from 'gql-tag';
import { bookFragment } from './bookFragment';

export const booksQuery = gql`
  query Books {
    books {
      ...Book
    }
  }
  ${bookFragment}
`;
