import gql from 'gql-tag';
import { bookFragment } from './bookFragment';

export const bookQuery = gql`
  query Book($id: ID!) {
    book(id: $id) {
      ...Book
    }
  }
  ${bookFragment}
`;
