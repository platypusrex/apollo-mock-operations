export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
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

export type AddressFragment = {
  __typename?: 'Address';
  addressLineOne: string;
  city: string;
  state: string;
  zip: string;
};

export type BookFragment = {
  __typename?: 'Book';
  id: string;
  title: string;
  numPages: number;
  authorId: string;
};

export type BookQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type BookQuery = {
  __typename?: 'Query';
  book?: {
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  } | null;
};

export type BooksByAuthorIdQueryVariables = Exact<{
  authorId: Scalars['ID'];
}>;

export type BooksByAuthorIdQuery = {
  __typename?: 'Query';
  booksByAuthorId?: Array<{
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  }> | null;
};

export type BooksQueryVariables = Exact<{ [key: string]: never }>;

export type BooksQuery = {
  __typename?: 'Query';
  books: Array<{
    __typename?: 'Book';
    id: string;
    title: string;
    numPages: number;
    authorId: string;
  }>;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type CreateUserMutation = {
  __typename?: 'Mutation';
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

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['ID'];
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type DeleteUserMutation = {
  __typename?: 'Mutation';
  deleteUser?: {
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

export type UserFragment = {
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

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type UserQuery = {
  __typename?: 'Query';
  user?: {
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

export type UsersQueryVariables = Exact<{
  includeAddress?: InputMaybe<Scalars['Boolean']>;
}>;

export type UsersQuery = {
  __typename?: 'Query';
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
