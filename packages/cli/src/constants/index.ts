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

export type TemplateType = 'ts' | 'js';

export const templates = {
  codegen: 'codegen.ts',
  codegenJS: 'codegen.js',
  codegenIntrospection: 'codegen-introspection.ts',
  codegenNoConfig: 'codegen-no-config.ts',
  codegenNoConfigJS: 'codegen-no-config.js',
  apolloMockConfig: 'apolloMock.config.ts',
  builderTS: 'builder.ts',
  builderJS: 'builder.js',
  builderIndexTS: 'index.ts',
  builderIndexJS: 'index.js',
} as const;
