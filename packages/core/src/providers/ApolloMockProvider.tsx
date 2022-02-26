import React, { useMemo } from 'react';
import { ApolloProvider } from '@apollo/client';
import { CreateApolloClient, createApolloClient } from '../utils';

export interface ApolloMockedProviderProps extends CreateApolloClient {
  Provider?: React.ComponentType<any>;
}

export const ApolloMockedProvider: React.FC<ApolloMockedProviderProps> = ({
  children,
  Provider = ApolloProvider,
  ...rest
}) => {
  const client = useMemo(() => createApolloClient(rest), [rest]);
  return <Provider client={client}>{children}</Provider>;
};
