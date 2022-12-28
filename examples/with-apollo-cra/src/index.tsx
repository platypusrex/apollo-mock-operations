import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { ApolloProvider } from '@apollo/client';
import { client } from './lib/apollo/client';
import { Devtools } from './lib/mocks';
import reportWebVitals from './reportWebVitals';
import '@apollo-mock-operations/core/devtools-styles.css'
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Devtools />
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
