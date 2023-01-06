import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import type {
  ApolloClientOptions,
  NormalizedCacheObject,
  InMemoryCacheConfig,
} from '@apollo/client';
import type { LinkSchemaProps } from '../types';
import { ApolloMockLink } from '../ApolloMockLink';

export interface CreateApolloClient {
  mocks: LinkSchemaProps;
  cacheOptions?: Omit<InMemoryCacheConfig, 'addTypename'>;
  clientOptions?: Omit<ApolloClientOptions<NormalizedCacheObject>, 'cache'>;
  links?: (cache?: InMemoryCache) => ApolloLink[];
}

export function createApolloClient({
  mocks,
  cacheOptions = {},
  clientOptions = {} as any,
  links = (): ApolloLink[] => [],
}: CreateApolloClient): ApolloClient<NormalizedCacheObject> {
  const mockLink = new ApolloMockLink({ mocks, loading: true });
  const cache = new InMemoryCache({ ...cacheOptions, addTypename: true });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([...links(cache), mockLink]),
    ...clientOptions,
  });
}
