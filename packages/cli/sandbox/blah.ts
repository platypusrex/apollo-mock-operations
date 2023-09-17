import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000',
  documents: 'src/operations/**/*.ts',
  generates: {
    'src/gql/': {
      preset: 'client',
      plugins: [
        '@apollo-mock-operations/codegen-plugin'
      ]
    },
    'src/mocking/introspection.json': {
      plugins: [
        '@graphql-codegen/introspection'
      ]
    }
  }
};

export default config;
