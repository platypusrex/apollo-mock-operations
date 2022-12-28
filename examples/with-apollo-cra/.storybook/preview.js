import '../src/index.css';
import { MockProvider as Provider } from '../src/lib/mocks'; // import the mock provider instance
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: { Provider }, // include the Apollo context provider as a storybook parameter
}
