import { GraphQLError } from 'graphql';

export const LOADING_ERROR_CODE = 'mock-gql-operation-loading';

export const generateOperationLoadingError = (): GraphQLError =>
  new GraphQLError('loading', [], undefined, [], undefined, undefined, {
    code: LOADING_ERROR_CODE,
  });
