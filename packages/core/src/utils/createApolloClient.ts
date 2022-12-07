import { buildClientSchema } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import type {
  ApolloClientOptions,
  NormalizedCacheObject,
  InMemoryCacheConfig,
} from '@apollo/client';
import type { CreateLinkOptions, LinkSchemaProps } from '../types';
import { createMockLink } from './createMockLink';

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
  const { resolvers, introspectionResult, rootValue, context, delay, onResolved } = mocks;

  const schema = buildClientSchema(introspectionResult);
  const mockOptions = { schema, resolvers };
  const schemaWithMocks = addMocksToSchema(mockOptions);

  const apolloLinkOptions: CreateLinkOptions = {};
  if (delay) apolloLinkOptions.delay = delay;
  if (onResolved) apolloLinkOptions.onResolved = onResolved;

  const mockLink = createMockLink(schemaWithMocks, rootValue, context, apolloLinkOptions);
  const cache = new InMemoryCache({ ...cacheOptions, addTypename: true });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([...links(cache), mockLink]),
    ...clientOptions,
  });
}
