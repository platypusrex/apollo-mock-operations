import { ApolloClient, InMemoryCache } from '@apollo/client';
import type { NormalizedCacheObject } from '@apollo/client';
import { createLoadingLink } from './createLoadingLink';

export const createLoadingApolloClient = (): ApolloClient<NormalizedCacheObject> =>
  new ApolloClient({ link: createLoadingLink(), cache: new InMemoryCache() });
