import { GraphQLError } from 'graphql';

export function createGraphQLErrorMessage(graphQLError?: string | GraphQLError[]): GraphQLError[] {
  if (graphQLError) {
    return typeof graphQLError === 'string' ? [new GraphQLError(graphQLError)] : graphQLError;
  }

  return [new GraphQLError('Unspecified graphql error.')];
}
