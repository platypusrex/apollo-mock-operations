export const codegenClientPresetPackages = [
  '@graphql-typed-document-node/core',
  '@graphql-codegen/client-preset',
];
export const codegenPackageNames = [
  'graphql',
  '@graphql-codegen/cli',
  '@graphql-codegen/introspection',
  '@apollo-mock-operations/codegen-plugin',
  '@graphql-typed-document-node/core',
  '@graphql-codegen/client-preset',
];

export const codegenPackageNamesNoTS = [
  'graphql',
  '@graphql-codegen/cli',
  '@graphql-codegen/introspection',
];

export const corePackages = ['@apollo-mock-operations/core'];

export const codegenPlugins = ['typescript', '@apollo-mock-operations/codegen-plugin'];

export const introspectionPlugin = ['introspection'];
// export const commonPackages = {
//   common() {
//     '@graphql-codegen/cli',
//   },
//
// };

export const templates = {
  codegen: 'codegen.ts',
  codegenIntrospection: 'codegen-introspection.ts',
  codegenNoConfig: 'codegen-no-config.ts',
  apolloMockConfig: 'apolloMock.config.ts',
  builderTS: 'builder.ts',
  builderJS: 'builder-js.js',
  builderIndexTS: 'builder-index.ts',
} as const;
