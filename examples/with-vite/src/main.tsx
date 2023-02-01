import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { App } from './App';
import { client } from './lib/apollo/client';
import { Devtools } from './lib/mocks';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Devtools />
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
