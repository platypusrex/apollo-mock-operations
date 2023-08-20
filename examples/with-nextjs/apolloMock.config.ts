import { OperationStateConfig } from '@apollo-mock-operations/codegen-plugin';
import { Query, Mutation } from './src/typings/generated';

const config: OperationStateConfig<Query, Mutation> = {
  operationState: {
    book: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR', 'LOADING'],
    booksByAuthorId: ['SUCCESS'],
    users: ['SUCCESS', 'LOADING', 'NETWORK_ERROR', 'GQL_ERROR'],
    user: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR'],
    createUser: ['SUCCESS', 'GQL_ERROR'],
    deleteUser: ['SUCCESS'],
    books: ['SUCCESS'],
  },
};

// eslint-disable-next-line import/no-default-export
export default config;
