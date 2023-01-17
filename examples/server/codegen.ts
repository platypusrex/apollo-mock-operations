import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:4000",
  generates: {
    "src/typings/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
