import '@apollo-mock-operations/core/devtools-styles.css';
import '@examples/common/common.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../lib/apollo';
import { Devtools } from '../lib/mocks';

export default function App({ Component, pageProps }: AppProps) {
  const client = useApolloClient(pageProps);
  return (
    <ApolloProvider client={client}>
      <Devtools />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
