import React from 'react';
import { ComponentMeta } from '@storybook/react';
import { StoryWithApollo } from '@apollo-mock-operations/storybook-addon';
import { UserDetail } from '@examples/common';
import NextLink from 'next/link';
import { MockProvider } from '../lib/mocks';

export default {
  title: 'Example/UserDetail',
  component: UserDetail,
  args: { id: '1' },
} as ComponentMeta<typeof UserDetail>;

const Template: StoryWithApollo<typeof MockProvider, typeof UserDetail> = (props) => (
  <UserDetail {...props}>
    <NextLink href="/">Back to users</NextLink>
  </UserDetail>
);

export const Success = Template.bind({});
