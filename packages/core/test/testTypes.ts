/* eslint-disable */
import { GraphQLError, GraphQLResolveInfo } from 'graphql';

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Address = {
  __typename?: 'Address';
  addressLineOne: Scalars['String'];
  addressLineTwo?: Maybe<Scalars['String']>;
  city: Scalars['String'];
  state: Scalars['String'];
  zip: Scalars['String'];
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<User>;
  authorId: Scalars['ID'];
  id: Scalars['ID'];
  numPages: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateBookInput = {
  authorId: Scalars['ID'];
  numPages: Scalars['Int'];
  title: Scalars['String'];
};

export type CreateUserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBook: Book;
  createUser: User;
  deleteBook?: Maybe<Book>;
  deleteUser?: Maybe<User>;
};

export type MutationCreateBookArgs = {
  input: CreateBookInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationDeleteBookArgs = {
  id: Scalars['ID'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  book?: Maybe<Book>;
  books: Array<Book>;
  booksByAuthorId?: Maybe<Array<Book>>;
  user?: Maybe<User>;
  users: Array<User>;
};

export type QueryBookArgs = {
  id: Scalars['ID'];
};

export type QueryBooksByAuthorIdArgs = {
  authorId: Scalars['ID'];
};

export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Array<Address>>;
  books?: Maybe<Array<Book>>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type GraphqlError = { graphQLError?: GraphQLError };
export type NetworkError = { networkError?: Error };
export type OperationLoading = { loading?: boolean };
export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult | GraphqlError | NetworkError | OperationLoading;

type ResolverType<TResult, TArgs> = Record<
  keyof TResult,
  ResolverFn<TResult[keyof TResult], {}, {}, TArgs>
>;

export type BookMockOperationArgs = Exact<{
  id: Scalars['ID'];
}>;

export type BookMockOperationResult = {
  book: {
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  } | null;
};

export type BookMockOperation = ResolverType<BookMockOperationResult, BookMockOperationArgs>;

export type BooksByAuthorIdMockOperationArgs = Exact<{
  authorId: Scalars['ID'];
}>;

export type BooksByAuthorIdMockOperationResult = {
  booksByAuthorId: Array<{
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  }> | null;
};

export type BooksByAuthorIdMockOperation = ResolverType<
  BooksByAuthorIdMockOperationResult,
  BooksByAuthorIdMockOperationArgs
>;

export type BooksMockOperationArgs = Exact<{ [key: string]: never }>;

export type BooksMockOperationResult = {
  books: Array<{
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  }>;
};

export type BooksMockOperation = ResolverType<BooksMockOperationResult, BooksMockOperationArgs>;

export type CreateUserMockOperationArgs = Exact<{
  input: CreateUserInput;
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type CreateUserMockOperationResult = {
  createUser: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    address?: Array<{
      __typename?: 'Address';
      addressLineOne: string;
      city: string;
      state: string;
      zip: string;
    }> | null;
  };
};

export type CreateUserMockOperation = ResolverType<
  CreateUserMockOperationResult,
  CreateUserMockOperationArgs
>;

export type DeleteUserMockOperationArgs = Exact<{
  id: Scalars['ID'];
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type DeleteUserMockOperationResult = {
  deleteUser: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    address?: Array<{
      __typename?: 'Address';
      addressLineOne: string;
      city: string;
      state: string;
      zip: string;
    }> | null;
  } | null;
};

export type DeleteUserMockOperation = ResolverType<
  DeleteUserMockOperationResult,
  DeleteUserMockOperationArgs
>;

export type UserMockOperationArgs = Exact<{
  id: Scalars['ID'];
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type UserMockOperationResult = {
  user: {
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    address?: Array<{
      __typename?: 'Address';
      addressLineOne: string;
      city: string;
      state: string;
      zip: string;
    }> | null;
  } | null;
};

export type UserMockOperation = ResolverType<UserMockOperationResult, UserMockOperationArgs>;

export type UsersMockOperationArgs = Exact<{
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type UsersMockOperationResult = {
  users: Array<{
    __typename?: 'User';
    id: string;
    name: string;
    email: string;
    address?: Array<{
      __typename?: 'Address';
      addressLineOne: string;
      city: string;
      state: string;
      zip: string;
    }> | null;
  }>;
};

export type UsersMockOperation = ResolverType<UsersMockOperationResult, UsersMockOperationArgs>;

export type QueryMockOperations = BookMockOperation &
  BooksByAuthorIdMockOperation &
  BooksMockOperation &
  UserMockOperation &
  UsersMockOperation;

export type MutationMockOperations = CreateUserMockOperation & DeleteUserMockOperation;

export type MockOperations = {
  Query: Partial<QueryMockOperations>;
  Mutation: Partial<MutationMockOperations>;
};
/* eslint-enable */
