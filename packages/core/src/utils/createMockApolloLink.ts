import { ApolloLink, HttpLink } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { IResolvers } from '@graphql-tools/utils';
import { LinkSchemaProps, MockGQLOperationsType } from '../types';
import { ApolloMockLink } from '../ApolloMockLink';

type CreateMockApolloLinkOptions<TState> = {
  mocks: LinkSchemaProps;
  createOperations: (state?: TState) => IResolvers;
  enabled?: boolean;
};

type CreateMockApolloLinkResponse = (httpLink: HttpLink | BatchHttpLink) => ApolloLink;

export const createMockApolloLink =
  <TState extends Partial<MockGQLOperationsType['Query' | 'Mutation']['state']>>({
    mocks,
    createOperations,
    enabled,
  }: CreateMockApolloLinkOptions<TState>): CreateMockApolloLinkResponse =>
  (httpLink) => {
    if (!enabled) return httpLink;

    return new ApolloMockLink({
      mocks,
      createOperations,
    });
  };
