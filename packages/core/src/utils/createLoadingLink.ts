import { ApolloLink, Observable } from '@apollo/client';

export function createLoadingLink(): ApolloLink {
  return new ApolloLink(() => {
    return new Observable(() => {});
  });
}
