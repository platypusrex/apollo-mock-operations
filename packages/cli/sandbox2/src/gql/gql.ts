/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  fragment Address on Address {\n    addressLineOne\n    city\n    state\n    zip\n  }\n": types.AddressFragmentDoc,
    "\n  fragment Book on Book {\n    id\n    title\n    numPages\n    authorId\n  }\n": types.BookFragmentDoc,
    "\n  query Book($id: ID!) {\n    book(id: $id) {\n      ...Book\n    }\n  }\n  \n": types.BookDocument,
    "\n  query BooksByAuthorId($authorId: ID!) {\n    booksByAuthorId(authorId: $authorId) {\n      ...Book\n    }\n  }\n  \n": types.BooksByAuthorIdDocument,
    "\n  query Books {\n    books {\n      ...Book\n    }\n  }\n  \n": types.BooksDocument,
    "\n  mutation CreateUser($input: CreateUserInput!, $includeAddress: Boolean = true) {\n    createUser(input: $input) {\n      ...User\n    }\n  }\n  \n": types.CreateUserDocument,
    "\n  mutation DeleteUser($id: ID!, $includeAddress: Boolean = true) {\n    deleteUser(id: $id) {\n      ...User\n    }\n  }\n  \n": types.DeleteUserDocument,
    "\n  fragment User on User {\n    id\n    name\n    email\n    address @include(if: $includeAddress) {\n      ...Address\n    }\n  }\n  \n": types.UserFragmentDoc,
    "\n  query User($id: ID!, $includeAddress: Boolean = true) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n": types.UserDocument,
    "\n  query Users($includeAddress: Boolean = true) {\n    users {\n      ...User\n    }\n  }\n  \n": types.UsersDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Address on Address {\n    addressLineOne\n    city\n    state\n    zip\n  }\n"): (typeof documents)["\n  fragment Address on Address {\n    addressLineOne\n    city\n    state\n    zip\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment Book on Book {\n    id\n    title\n    numPages\n    authorId\n  }\n"): (typeof documents)["\n  fragment Book on Book {\n    id\n    title\n    numPages\n    authorId\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Book($id: ID!) {\n    book(id: $id) {\n      ...Book\n    }\n  }\n  \n"): (typeof documents)["\n  query Book($id: ID!) {\n    book(id: $id) {\n      ...Book\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query BooksByAuthorId($authorId: ID!) {\n    booksByAuthorId(authorId: $authorId) {\n      ...Book\n    }\n  }\n  \n"): (typeof documents)["\n  query BooksByAuthorId($authorId: ID!) {\n    booksByAuthorId(authorId: $authorId) {\n      ...Book\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Books {\n    books {\n      ...Book\n    }\n  }\n  \n"): (typeof documents)["\n  query Books {\n    books {\n      ...Book\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation CreateUser($input: CreateUserInput!, $includeAddress: Boolean = true) {\n    createUser(input: $input) {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  mutation CreateUser($input: CreateUserInput!, $includeAddress: Boolean = true) {\n    createUser(input: $input) {\n      ...User\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation DeleteUser($id: ID!, $includeAddress: Boolean = true) {\n    deleteUser(id: $id) {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  mutation DeleteUser($id: ID!, $includeAddress: Boolean = true) {\n    deleteUser(id: $id) {\n      ...User\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment User on User {\n    id\n    name\n    email\n    address @include(if: $includeAddress) {\n      ...Address\n    }\n  }\n  \n"): (typeof documents)["\n  fragment User on User {\n    id\n    name\n    email\n    address @include(if: $includeAddress) {\n      ...Address\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query User($id: ID!, $includeAddress: Boolean = true) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  query User($id: ID!, $includeAddress: Boolean = true) {\n    user(id: $id) {\n      ...User\n    }\n  }\n  \n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query Users($includeAddress: Boolean = true) {\n    users {\n      ...User\n    }\n  }\n  \n"): (typeof documents)["\n  query Users($includeAddress: Boolean = true) {\n    users {\n      ...User\n    }\n  }\n  \n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;