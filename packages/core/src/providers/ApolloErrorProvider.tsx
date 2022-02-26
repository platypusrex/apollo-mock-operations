import React, { useMemo } from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { GraphQLError } from 'graphql';
import { createErrorLink } from '../utils';

export interface ApolloErrorProviderProps {
  graphQLError?: string | GraphQLError[];
  Provider?: React.ComponentType<any>;
}

export const ApolloErrorProvider: React.FC<ApolloErrorProviderProps> = ({
  children,
  graphQLError,
  Provider = ApolloProvider,
}) => {
  const client = useMemo(() => {
    return new ApolloClient({
      link: createErrorLink(graphQLError),
      cache: new InMemoryCache(),
    });
  }, [graphQLError]);

  return <Provider client={client}>{children}</Provider>;
};
