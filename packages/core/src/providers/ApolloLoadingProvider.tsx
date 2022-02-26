import React, { useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { createLoadingLink } from '../utils';

export interface ApolloLoadingProviderProps {
  Provider?: React.ComponentType<any>;
}

export const ApolloLoadingProvider: React.FC<ApolloLoadingProviderProps> = ({
  Provider = ApolloProvider,
  children,
}) => {
  const client = useMemo(() => {
    return new ApolloClient({ link: createLoadingLink(), cache: new InMemoryCache() })
  }, []);

  return <Provider client={client}>{children}</Provider>;
};
