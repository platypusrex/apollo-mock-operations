import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '<codegen-schema>',
  documents: '<codegen-documents>',
  generates: {
    '<codegen-generated-location>': {
      preset: 'client',
      plugins: ['@apollo-mock-operations/codegen-plugin'],
    },
    '<codegen-introspection-location>': {
      plugins: ['introspection'],
    },
  },
};

export default config;
