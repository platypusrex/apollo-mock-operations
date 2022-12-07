import type { ComponentType, FC } from 'react';
import { useParameter, useCallback, useGlobals, useState, useEffect } from '@storybook/addons';
import type {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
  InMemoryCacheConfig,
  NormalizedCacheObject,
} from '@apollo/client';
import type { OperationMeta } from '../types/shared';
import { ADDON_ID, PARAM_KEY } from '../constants';

interface MockProviderProps<TOperationState> {
  Provider: ComponentType<any>;
  operationState: Partial<TOperationState>;
  delay?: number;
  cacheOptions?: Omit<InMemoryCacheConfig, 'addTypename'>;
  clientOptions?: Pick<
    ApolloClientOptions<NormalizedCacheObject>,
    | 'headers'
    | 'queryDeduplication'
    | 'defaultOptions'
    | 'assumeImmutableResults'
    | 'typeDefs'
    | 'fragmentMatcher'
    | 'connectToDevTools'
  >;
  links?: (cache?: InMemoryCache) => ApolloLink[];
}

export const WithApolloClient = (Story: FC<unknown>): JSX.Element => {
  const [operationsArr, setOperationsArr] = useState<OperationMeta[]>([]);
  const { Provider, ...providerProps } = useParameter<MockProviderProps<any>>(
    PARAM_KEY,
    {} as any
  ) as MockProviderProps<any>;

  const [, setGlobals] = useGlobals();

  useEffect(() => {
    setGlobals({ [`${ADDON_ID}/operations`]: operationsArr });
  }, [operationsArr]);

  const handleResolvedOperation = useCallback((operationMeta: OperationMeta) => {
    setOperationsArr((prevState) => {
      const existingOperation = prevState.filter(
        (meta) => meta.operationName === operationMeta.operationName
      );

      if (existingOperation?.length) {
        const { operationName } = operationMeta;
        return [
          ...prevState,
          {
            ...operationMeta,
            operationName,
            operationCount: existingOperation?.length,
          },
        ];
      }
      return [...prevState, operationMeta];
    });
  }, []);

  if (!Provider) {
    console.warn(
      'storybook-addon-apollo-client: MockedProvider is missing from parameters in preview.js'
    );
    return <Story />;
  }

  return (
    <Provider {...providerProps} onResolved={handleResolvedOperation}>
      <Story />
    </Provider>
  );
};
