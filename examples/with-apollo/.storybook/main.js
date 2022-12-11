module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@apollo-mock-operations/storybook-addon',
  ],
  framework: '@storybook/react',
  core: {
    builder: 'webpack5',
  },
}
