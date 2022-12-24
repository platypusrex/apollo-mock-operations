import { Book, Resolvers, User } from '../typings/generated';
import { userMap, bookMap } from '../models';

export const resolvers: Resolvers = {
  Query: {
    user: (_, { id }) => userMap.get(id) as User,
    users: () => Array.from(userMap.values()),
    book: (_, { id }) => bookMap.get(id) as Book,
    books: () => Array.from(bookMap.values()),
    booksByAuthorId: (_, { authorId }) =>
      Array.from(bookMap.values()).filter((book) => book.authorId === authorId),
  },
  Mutation: {
    createUser: (_, { input: { name, email } }) => {
      const newUser = { id: String(userMap.size + 1), name, email };
      userMap.set(newUser.id, newUser);
      return newUser;
    },
    deleteUser: (_, { id }) => {
      const user = { ...userMap.get(id) };
      userMap.delete(id);
      return user as User;
    },
    createBook: (_, { input: { title, numPages, authorId } }) => {
      const newBook = { id: String(bookMap.size + 1), title, numPages, authorId };
      bookMap.set(newBook.id, newBook);
      return newBook;
    },
    deleteBook: (_, { id }) => {
      const book = { ...bookMap.get(id) };
      bookMap.delete(id);
      return book as Book;
    },
  },
};
