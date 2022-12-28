import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000',
  documents: ['src/gql/**/*.ts'],
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    'src/typings/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ]
    },
  },
};

export default config;
