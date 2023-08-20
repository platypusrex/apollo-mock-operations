const config = {
  overwrite: true,
  schema: 'http://localhost:4000',
  documents: '../common/src/gql/**/*.ts',
  hooks: { afterAllFileWrite: ['prettier --write'] },
  generates: {
    'src/typings/generated.d.ts': {
      plugins: ['typescript', '@apollo-mock-operations/codegen-plugin']
    },
    'src/lib/mocks/introspection.json': {
      plugins: ['introspection']
    },
  },
};

module.exports = config;
