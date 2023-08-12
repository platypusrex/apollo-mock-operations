import '@examples/common/common.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
// import dynamic from 'next/dynamic';
import { ApolloProvider } from '@apollo/client';
import { useApolloClient } from '../lib/apollo';
import { Devtools } from '../lib/mocks';

// const Devtools = dynamic(() =>
//   import('../lib/mocks').then((mod) => mod.Devtools), {
//   ssr: false,
// });

export default function App({ Component, pageProps }: AppProps) {
  const client = useApolloClient(pageProps);
  return (
    <ApolloProvider client={client}>
      <Devtools />
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
