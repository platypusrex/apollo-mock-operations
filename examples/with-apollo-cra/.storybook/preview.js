import { withRouter } from 'storybook-addon-react-router-v6';
import '@examples/common/common.css';
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
  layout: 'fullscreen',
  apolloClient: { Provider }, // include the Apollo context provider as a storybook parameter
}

export const decorators = [withRouter];
