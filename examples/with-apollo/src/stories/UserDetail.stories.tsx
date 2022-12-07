import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { StoryWithApollo } from '@apollo-mock-operations/storybook-addon';
import { UserDetail } from '../modules/user/user-detail';
import { MockProvider } from '../lib/mocks';

export default {
  title: 'Example/UserDetail',
  component: UserDetail,
  args: { id: '1' },
} as ComponentMeta<typeof UserDetail>;

const Template: StoryWithApollo<typeof MockProvider, typeof UserDetail> = (props) => (
  <UserDetail {...props} />
);

export const Success = Template.bind({});
