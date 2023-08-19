import { IncomingHttpHeaders } from 'http';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { NextApolloClient } from 'nextjs-apollo-client';
import { mockLink } from '../mocks';
import { hydrationMap } from './hydrationMap';

const httpLink = (headers?: IncomingHttpHeaders | null) =>
  new HttpLink({
    uri: 'http://localhost:4000',
    headers: (headers as Record<string, string>) ?? undefined,
  });

export const { getServerSideApolloProps, useApolloClient } = new NextApolloClient<
  typeof hydrationMap
>({
  client: (initialState, headers) =>
    new ApolloClient({
      ssrMode: typeof window === 'undefined',
      cache: new InMemoryCache().restore(initialState),
      link: mockLink(httpLink(headers)),
    }),
  hydrationMap,
});
