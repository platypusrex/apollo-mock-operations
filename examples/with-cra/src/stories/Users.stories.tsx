import React from 'react';
import { Link } from 'react-router-dom';
import { ComponentMeta } from '@storybook/react';
import { StoryWithApollo } from '@apollo-mock-operations/storybook-addon';
import { Users } from '@examples/common';
import { MockProvider } from '../lib/mocks';

export default {
  title: 'Example/Users',
  component: Users,
  args: { includeUserAddress: true },
} as ComponentMeta<typeof Users>;

const Template: StoryWithApollo<typeof MockProvider, typeof Users> = (props) => (
  <Users
    {...props}
    link={(user) => (
      <Link to={`user/${user.id}`}>
        {user.name}
      </Link>
    )}
  />
);

export const Success = Template.bind({});

export const DelayResponse = Template.bind({});
DelayResponse.parameters = {
  apolloClient: {
    delay: 2000,
  },
};

export const NetworkError = Template.bind({});
NetworkError.parameters = {
  apolloClient: {
    operationState: {
      users: 'NETWORK_ERROR',
      book: 'NETWORK_ERROR',
      deleteUser: 'SUCCESS',
      createUser: ''
    },
  },
};

export const GQLError = Template.bind({});
GQLError.parameters = {
  apolloClient: {
    operationState: {
      users: 'GQL_ERROR',
    },
  },
};

export const FirstUserOnly = Template.bind({});
FirstUserOnly.parameters = {
  apolloClient: {
    operationState: { createUser: 'GQL_ERROR' },
    mergeOperations: ({ user }) => ({
      users: () => [user.models[0]],
    }),
  },
};

export const BookById = Template.bind({});
BookById.parameters = {
  apolloClient: {
    mergeOperations: ({ book }) => ({
      book: () => book.findOne({ where: { id: '2' } }),
    }),
  },
};

export const Loading = Template.bind({});
Loading.parameters = {
  apolloClient: {
    loading: true,
  },
};

export const OnlyUsersLoading = Template.bind({});
OnlyUsersLoading.parameters = {
  apolloClient: {
    operationState: {
      users: 'LOADING',
    },
  },
};

export const OnlyBookLoading = Template.bind({});
OnlyBookLoading.parameters = {
  apolloClient: {
    operationState: {
      book: 'LOADING',
    },
  },
};
