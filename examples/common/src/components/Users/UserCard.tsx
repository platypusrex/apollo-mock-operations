import React from 'react';
import { useDeleteUser } from '../../hooks';
import { UserFragment } from '../../typings';

interface UserCardProps {
  user: UserFragment;
  link?: (user: UserFragment) => React.ReactNode;
}

export const UserCard: React.FC<UserCardProps> = ({ user, link }) => {
  const { deleteUser, loading, error } = useDeleteUser({
    refetchQueries: ['Users'],
    update: (cache, { data }) => {
      const result = data?.deleteUser;
      if (!result) return;

      const normalizedId = cache.identify(result);
      cache.evict({ id: normalizedId });
      cache.gc();
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
