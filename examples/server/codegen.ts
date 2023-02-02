import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/schema/typeDefs.ts",
  generates: {
    "src/typings/generated.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  }
};

export default config;
