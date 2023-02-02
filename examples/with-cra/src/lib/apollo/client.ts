import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { mockLink } from '../mocks';

const httpLink = new HttpLink({
  uri: 'http://localhost:4000'
})

export const client = new ApolloClient({
  uri: 'http://localhost:4001/',
  cache: new InMemoryCache(),
  link: mockLink(httpLink)
});
