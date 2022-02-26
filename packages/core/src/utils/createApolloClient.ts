import { buildClientSchema } from 'graphql';
import { addMocksToSchema } from '@graphql-tools/mock';
import {
  ApolloClient,
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject
} from '@apollo/client';
import { createMockLink } from './createMockLink';
import { CreateLinkOptions, LinkSchemaProps } from '../types';

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
  links = () => [],
}: CreateApolloClient) {
  const {
    resolvers,
    introspectionResult,
    rootValue,
    context,
    delay,
    onResolved,
  } = mocks;

  const schema = buildClientSchema(introspectionResult);

  const mockOptions = {
    schema,
    resolvers,
    // preserveResolvers: false,
  };

  const schemaWithMocks = addMocksToSchema(mockOptions as any);

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
