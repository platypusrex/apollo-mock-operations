export const typeDefs = `#graphql
  type Address {
    addressLineOne: String!
    addressLineTwo: String
    city: String!
    state: String!
    zip: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    address: [Address!]
    books: [Book!]
  }

  type Book {
    id: ID!
    title: String!
    numPages: Int!
    authorId: ID!
    author: User
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateBookInput {
    title: String!
    numPages: Int!
    authorId: ID!
  }

  type Query {
    user(id: ID!): User
    users: [User!]!
    book(id: ID!): Book
    books: [Book!]!
    booksByAuthorId(authorId: ID!): [Book!]
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    deleteUser(id: ID!): User
    createBook(input: CreateBookInput!): Book!
    deleteBook(id: ID!): Book
  }
`;
