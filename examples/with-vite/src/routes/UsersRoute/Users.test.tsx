import React, { ComponentProps } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MockProvider, models } from '../../lib/mocks';
import { Users } from '@examples/common';

const TestComponent: React.FC<ComponentProps<typeof MockProvider>> = (props) => (
  <MockProvider {...props}>
    <Users />
  </MockProvider>
);

describe('Users', () => {
  describe('Loading states', () => {
    const book = models.book.findOne({ where: { id: '1' } });
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
  });

  describe('Error states', () => {
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
  });

  it('should render a list of user cards', async () => {
    render(<TestComponent />);
    const headingNodes = await screen.findAllByRole('heading', { name: /user name/i, level: 3 });
    expect(headingNodes).toHaveLength(4);
    headingNodes.forEach((node) => {
      expect(node).toBeInTheDocument();
    });
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
    const user = models.user.findFirst();
    render(<TestComponent />);
    const userCard = await screen.findByText(user?.name ?? '', { exact: true });
    expect(userCard).toBeInTheDocument();
  });

  it('find all from list using operation models', async () => {
    const users = models.user.models;
    render(<TestComponent />);
    for (const user of users) {
      const headingNode = await screen.findByText(user.name);
      expect(headingNode).toBeInTheDocument();
    }
  });

  it('test that a mutation was performed using mergeResolvers', async () => {
    const deleteUser = jest.fn(() => ({}));
    render(<TestComponent mergeOperations={{ deleteUser }} />);

    const btnNode = await screen.findByText(/Delete William/);
    expect(btnNode).toBeInTheDocument();
    fireEvent.click(btnNode);

    await waitFor(() => {
      expect(deleteUser).toHaveBeenCalledTimes(1);
    });
  });
});
