import { OperationStateConfig } from '@apollo-mock-operations/codegen-plugin';

const config: OperationStateConfig = {
  operationState: {
    book: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR', 'LOADING'],
    booksByAuthorId: ['SUCCESS'],
    users: ['SUCCESS', 'LOADING', 'NETWORK_ERROR', 'GQL_ERROR'],
    user: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR'],
    createUser: ['SUCCESS', 'GQL_ERROR'],
    deleteUser: ['SUCCESS'],
  },
};

export default config;
