import React from 'react';
import NextLink from 'next/link';
import { useDeleteUser } from '../../../hooks/useDeleteUser';
import { usersQuery } from '../../../gql';
import styles from './Users.module.css';

interface UserCardProps {
  user: UserFragment;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
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
    <div key={user.id} className={styles.userCard}>
      <NextLink href={{ pathname: '/user/[id]', query: { id: user.id } }}>
        <h3>{user.name}</h3>
      </NextLink>
      <p>{user.email}</p>
      <pre className={styles.usersCodeBlock}>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
      <button onClick={handleDeleteUser}>{loading ? 'Loading...' : `Delete ${user.name}`}</button>
      {error && <span>{JSON.stringify(error, null, 2)}</span>}
    </div>
  );
};
