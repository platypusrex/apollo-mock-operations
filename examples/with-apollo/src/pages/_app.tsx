import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../lib/apollo';

export default function App({ Component, pageProps }: AppProps) {
  const client = useApolloClient(pageProps);
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
