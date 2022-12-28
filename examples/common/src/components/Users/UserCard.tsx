import React from 'react';
import { useDeleteUser } from '../../hooks';
import { usersQuery } from '../../gql';
import { UserFragment, UsersQuery } from '../../typings';

interface UserCardProps {
  user: UserFragment;
  link?: (user: UserFragment) => React.ReactNode;
}

export const UserCard: React.FC<UserCardProps> = ({ user, link }) => {
  const { deleteUser, loading, error } = useDeleteUser({
    update: (cache, { data }) => {
      const result = data?.deleteUser;
      if (!result) return;
      const currentUsers = cache.readQuery<UsersQuery>({
        query: usersQuery,
      });

      const users = currentUsers?.users;
      if (!users) return;

      cache.writeQuery<UsersQuery>({
        query: usersQuery,
        data: {
          users: users.filter((user) => user.id !== result.id),
        },
      });
    },
  });

  const handleDeleteUser = async () => {
    await deleteUser({
      variables: { id: user.id },
    });
  };

  return (
    <div key={user.id} className="card">
      <h3>
        {link && link(user)}
      </h3>
      <p>{user.email}</p>
      <pre className="code-block">
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <button onClick={handleDeleteUser}>{loading ? 'Loading...' : `Delete ${user.name}`}</button>
      {error && <span>{JSON.stringify(error, null, 2)}</span>}
    </div>
  );
};
