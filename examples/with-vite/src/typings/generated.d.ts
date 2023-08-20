import { GraphQLError, GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type Address = {
  __typename?: 'Address';
  addressLineOne: Scalars['String']['output'];
  addressLineTwo?: Maybe<Scalars['String']['output']>;
  city: Scalars['String']['output'];
  state: Scalars['String']['output'];
  zip: Scalars['String']['output'];
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<User>;
  authorId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  numPages: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type CreateBookInput = {
  authorId: Scalars['ID']['input'];
  numPages: Scalars['Int']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
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
  id: Scalars['ID']['input'];
};

export type MutationDeleteUserArgs = {
  id: Scalars['ID']['input'];
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
  id: Scalars['ID']['input'];
};

export type QueryBooksByAuthorIdArgs = {
  authorId: Scalars['ID']['input'];
};

export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  address?: Maybe<Array<Address>>;
  books?: Maybe<Array<Book>>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
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

export type BookOperationArgs = Exact<{
  id: Scalars['ID']['input'];
}>;

export type BookOperationResult = {
  __typename?: 'Book';
  id: string;
  title: string;
  numPages: number;
  authorId: string;
} | null;

export type BookOperation = {
  book: {
    type: 'Query';
    resolver: ResolverFn<BookOperationResult, any, any, BookOperationArgs>;
    state: 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR' | 'LOADING';
  };
};

export type BooksByAuthorIdOperationArgs = Exact<{
  authorId: Scalars['ID']['input'];
}>;

export type BooksByAuthorIdOperationResult = Array<{
  __typename?: 'Book';
  id: string;
  title: string;
  numPages: number;
  authorId: string;
}> | null;

export type BooksByAuthorIdOperation = {
  booksByAuthorId: {
    type: 'Query';
    resolver: ResolverFn<BooksByAuthorIdOperationResult, any, any, BooksByAuthorIdOperationArgs>;
    state: 'SUCCESS';
  };
};

export type BooksOperationArgs = Exact<{ [key: string]: never }>;

export type BooksOperationResult = Array<{
  __typename?: 'Book';
  id: string;
  title: string;
  numPages: number;
  authorId: string;
}>;

export type BooksOperation = {
  books: {
    type: 'Query';
    resolver: ResolverFn<BooksOperationResult, any, any, BooksOperationArgs>;
    state: 'SUCCESS';
  };
};

export type CreateUserOperationArgs = Exact<{
  input: CreateUserInput;
  includeAddress?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type CreateUserOperationResult = {
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

export type CreateUserOperation = {
  createUser: {
    type: 'Mutation';
    resolver: ResolverFn<CreateUserOperationResult, any, any, CreateUserOperationArgs>;
    state: 'SUCCESS' | 'GQL_ERROR';
  };
};

export type DeleteUserOperationArgs = Exact<{
  id: Scalars['ID']['input'];
  includeAddress?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type DeleteUserOperationResult = {
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

export type DeleteUserOperation = {
  deleteUser: {
    type: 'Mutation';
    resolver: ResolverFn<DeleteUserOperationResult, any, any, DeleteUserOperationArgs>;
    state: 'SUCCESS';
  };
};

export type UserOperationArgs = Exact<{
  id: Scalars['ID']['input'];
  includeAddress?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type UserOperationResult = {
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

export type UserOperation = {
  user: {
    type: 'Query';
    resolver: ResolverFn<UserOperationResult, any, any, UserOperationArgs>;
    state: 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR';
  };
};

export type UsersOperationArgs = Exact<{
  includeAddress?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type UsersOperationResult = Array<{
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

export type UsersOperation = {
  users: {
    type: 'Query';
    resolver: ResolverFn<UsersOperationResult, any, any, UsersOperationArgs>;
    state: 'SUCCESS' | 'LOADING' | 'NETWORK_ERROR' | 'GQL_ERROR';
  };
};

export type QueryOperations = BookOperation &
  BooksByAuthorIdOperation &
  BooksOperation &
  UserOperation &
  UsersOperation;

export type MutationOperations = CreateUserOperation & DeleteUserOperation;

export type MockOperations = {
  Query: QueryOperations;
  Mutation: MutationOperations;
};

export type AddressModel = {
  Address: {
    __typename?: 'Address';
    addressLineOne: string;
    city: string;
    state: string;
    zip: string;
  };
};

export type BookModel = {
  Book: { __typename?: 'Book'; id: string; title: string; numPages: number; authorId: string };
};

export type UserModel = {
  User: {
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

export type OperationModels = AddressModel & BookModel & UserModel;
