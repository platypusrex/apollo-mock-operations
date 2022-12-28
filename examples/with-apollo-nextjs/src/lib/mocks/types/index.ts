import { OperationModelType, OperationState } from '@apollo-mock-operations/core';

// Operation types
type UsersOperationState = OperationState<
  UsersMockOperation,
  'SUCCESS' | 'NETWORK_ERROR' | 'GQL_ERROR' | 'LOADING'
>;
type UserOperationState = OperationState<
  UserMockOperation,
  'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR'
>;
type CreateUserOperationState = OperationState<CreateUserMockOperation, 'SUCCESS' | 'GQL_ERROR'>;
type DeleteUserOperationState = OperationState<DeleteUserMockOperation, 'SUCCESS'>;
type BookOperationState = OperationState<
  BookMockOperation,
  'SUCCESS' | 'EMPTY' | 'NETWORK_ERROR' | 'GQL_ERROR' | 'LOADING'
>;
type BooksByAuthorOperationState = OperationState<BooksByAuthorIdMockOperation, 'SUCCESS'>;

// Model types
type UserModel = OperationModelType<UserMockOperation>;
type BookModel = OperationModelType<BookMockOperation>;

export type State = UsersOperationState &
  UserOperationState &
  CreateUserOperationState &
  DeleteUserOperationState &
  BookOperationState &
  BooksByAuthorOperationState;

export type Models = UserModel & BookModel;
