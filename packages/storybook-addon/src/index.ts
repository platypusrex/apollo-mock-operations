/* eslint-disable import/no-import-module-exports */
import type { ComponentProps, JSXElementConstructor } from 'react';
import type { ComponentStory } from '@storybook/react';

type ReactComponentProps = JSXElementConstructor<any> | keyof JSX.IntrinsicElements;
interface ApolloStoryParameters<TProviderProps extends ReactComponentProps> {
  apolloClient: Omit<ComponentProps<TProviderProps>, 'children'>;
}

export interface StoryWithApollo<
  TProviderProps extends ReactComponentProps,
  TComponentProps extends ReactComponentProps = any
> extends ComponentStory<TComponentProps> {
  parameters?: ApolloStoryParameters<TProviderProps>;
}

if (module?.hot?.decline) {
  module.hot.decline();
}
