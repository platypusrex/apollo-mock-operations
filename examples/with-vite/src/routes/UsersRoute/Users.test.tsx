import React, { ComponentProps } from 'react';
import { vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Users } from '@examples/common';
import { MockProvider, models } from '../../lib/mocks';

const TestComponent: React.FC<ComponentProps<typeof MockProvider>> = (props) => (
  <MockProvider {...props}>
    <Users />
  </MockProvider>
);

const book = models.Book.findOne({ where: { id: '1' } });
it('should show loading state for specific operation', async () => {
  render(<TestComponent operationState={{ users: 'LOADING' }} />);

  const loadingNode = await screen.findByText(/loading/i);
  expect(loadingNode).toHaveTextContent('Loading users...');

  const bookNode = await screen.findByRole('heading', { name: /Title/ });
  expect(bookNode).toBeInTheDocument();
  expect(bookNode).toHaveTextContent(`Title: ${book?.title}`);
});

it('should show loading state for all operations', async () => {
  render(<TestComponent loading />);
  const loadingNodes = await screen.findAllByText(/loading/i);
  expect(loadingNodes).toHaveLength(2);
});

it('should render a graphql error', async () => {
  render(<TestComponent operationState={{ users: 'GQL_ERROR' }} />);
  const errorNode = await screen.findByText(/Graphql error:/);
  expect(errorNode).toBeInTheDocument();
  expect(errorNode).toHaveTextContent(`Graphql error: Server responded with 403`);
});

it('should render a network error', async () => {
  render(<TestComponent operationState={{ users: 'NETWORK_ERROR' }} />);
  const errorNode = await screen.findByText(/Network error:/);
  expect(errorNode).toBeInTheDocument();
  expect(errorNode).toHaveTextContent(`Network error: Server responded with 500`);
});

it('should render a delete button for each user card', async () => {
  render(<TestComponent />);
  const deleteButtonNodes = await screen.findAllByRole('button', { name: /delete/i });
  expect(deleteButtonNodes).toHaveLength(4);
  deleteButtonNodes.forEach((node) => {
    expect(node).toBeInTheDocument();
  });
});

it('find one from list using operation models', async () => {
  const user = models.User.findFirst();
  render(<TestComponent />);
  const userCard = await screen.findByText(user?.email ?? '');
  expect(userCard).toBeInTheDocument();
});

it('find all from list using operation models', async () => {
  const users = models.User.models;
  render(<TestComponent />);
  for (const user of users) {
    const headingNode = await screen.findByText(user.email);
    expect(headingNode).toBeInTheDocument();
  }
});

it('test that a mutation was performed using mergeResolvers', async () => {
  const deleteUser = vi.fn(() => ({}));
  render(<TestComponent mergeOperations={{ deleteUser }} />);

  const btnNode = await screen.findByText(/Delete William/);
  expect(btnNode).toBeInTheDocument();
  fireEvent.click(btnNode);

  await waitFor(() => {
    expect(deleteUser).toHaveBeenCalledTimes(1);
  });
});
