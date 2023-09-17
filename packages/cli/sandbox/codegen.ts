import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:4000',
  generates: {
    'src/mocking/introspection.json': {
      plugins: [
        'introspection'
      ]
    },
    'src/gql/': {
      preset: 'client',
      plugins: [
        '@apollo-mock-operations/codegen-plugin'
      ]
    }
  }
};

export default config;
