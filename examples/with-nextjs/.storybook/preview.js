import '@examples/common/common.css';
import '../src/styles/globals.css';
import { MockProvider as Provider } from '../src/lib/mocks';

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
  apolloClient: { Provider }
}
