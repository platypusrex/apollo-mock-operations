import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '<codegen-schema>',
  generates: {
    '<codegen-introspection-location>': {
      plugins: ['introspection'],
    },
  },
};

export default config;
