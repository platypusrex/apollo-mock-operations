import { graphql, GraphQLSchema, print } from 'graphql';
import { ApolloError, ApolloLink, Observable } from '@apollo/client';
import { delay } from './delay';
import { CreateLinkOptions } from '../types';

export function createMockLink(
  schema: GraphQLSchema,
  rootValue = {},
  context = {},
  options: CreateLinkOptions = {}
): ApolloLink {
  const delayMs = options?.delay ?? 0;

  return new ApolloLink((operation) => {
    return new Observable((observer) => {
      const { query, operationName, variables } = operation;
      delay(delayMs)
        .then(() => {
          return graphql({
            schema,
            source: print(query),
            rootValue,
            contextValue: context,
            variableValues: variables,
            operationName
          });
        })
        .then((result) => {
          const onResolved = options.onResolved;
          onResolved && onResolved({
            operationName,
            variables,
            query: print(query),
            result
          })
          const originalError = result?.errors?.[0].originalError as ApolloError;
          if (originalError) {
            const { graphQLErrors, networkError } = originalError ?? {};
            graphQLErrors && observer.next({ errors: graphQLErrors})
            networkError ? observer.error(networkError.message) : observer.error(originalError.message);
          } else {
            observer.next(result);
          }
          observer.complete();
        })
        .catch(observer.error.bind(observer));
    });
  });
}
