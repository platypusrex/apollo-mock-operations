module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  overrides: [
    {
      files: ['*.json', '*.yaml'],
      options: {
        useTabs: false,
      },
    },
  ],
  printWidth: 100,
  proseWrap: 'always',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
};
