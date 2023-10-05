const config  = {
  overwrite: true,
  schema: '<codegen-schema>',
  generates: {
    '<codegen-introspection-location>': {
      plugins: ['introspection'],
    },
  },
};

module.exports = config;
