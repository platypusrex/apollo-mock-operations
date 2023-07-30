import { GraphQLError, GraphQLResolveInfo } from 'graphql';
declare global {
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

  export type BookOperationArgs = Exact<{
    id: Scalars['ID'];
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
      kind: 'Query';
      resolver: ResolverFn<BookOperationResult, any, any, BookOperationArgs>;
      state: 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR' | 'LOADING';
    };
  };

  export type BooksByAuthorIdOperationArgs = Exact<{
    authorId: Scalars['ID'];
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
      kind: 'Query';
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
      kind: 'Query';
      resolver: ResolverFn<BooksOperationResult, any, any, BooksOperationArgs>;
      state: 'SUCCESS';
    };
  };

  export type CreateUserOperationArgs = Exact<{
    input: CreateUserInput;
    includeAddress?: InputMaybe<Scalars['Boolean']>;
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
      kind: 'Mutation';
      resolver: ResolverFn<CreateUserOperationResult, any, any, CreateUserOperationArgs>;
      state: 'SUCCESS' | 'GQL_ERROR';
    };
  };

  export type DeleteUserOperationArgs = Exact<{
    id: Scalars['ID'];
    includeAddress?: InputMaybe<Scalars['Boolean']>;
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
      kind: 'Mutation';
      resolver: ResolverFn<DeleteUserOperationResult, any, any, DeleteUserOperationArgs>;
      state: 'SUCCESS';
    };
  };

  export type UserOperationArgs = Exact<{
    id: Scalars['ID'];
    includeAddress?: InputMaybe<Scalars['Boolean']>;
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
      kind: 'Query';
      resolver: ResolverFn<UserOperationResult, any, any, UserOperationArgs>;
      state: 'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR';
    };
  };

  export type UsersOperationArgs = Exact<{
    includeAddress?: InputMaybe<Scalars['Boolean']>;
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
      kind: 'Query';
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
}
