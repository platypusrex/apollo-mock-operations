import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000',
  documents: '../common/src/gql/**/*.ts',
  hooks: { afterAllFileWrite: ['prettier --write'] },
  generates: {
    'src/typings/generated.d.ts': {
      plugins: [
        {
          add: {
            content: ['declare global {']
          }
        },
        {
          add: {
            placement: 'append',
            content: '}'
          }
        },
        'typescript',
        {
          '@apollo-mock-operations/codegen-plugin': {
            operationState: {
              book: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR', 'LOADING'],
              booksByAuthorId: ['SUCCESS'],
              users: ['SUCCESS', 'LOADING', 'NETWORK_ERROR', 'GQL_ERROR'],
              user: ['SUCCESS', 'EMPTY', 'NETWORK_ERROR', 'GQL_ERROR'],
              createUser: ['SUCCESS', 'GQL_ERROR'],
              deleteUser: ['SUCCESS']
            }
          }
        },
      ],

    },
    'src/lib/mocks/introspection.json': {
      plugins: ['introspection']
    },
  },
};

export default config;
