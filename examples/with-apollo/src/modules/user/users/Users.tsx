import React, { FormEvent } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useUsers } from '../../../hooks/useUsers';
import { useBook } from '../../../hooks/useBook';
import { useCreateUser } from '../../../hooks/useCreateUser';
import { usersQuery } from '../../../gql';
import { UserCard } from './UserCard';
import styles from './Users.module.css';

interface UsersProps {
  // prop that controls the @include directive on the user fragment
  includeUserAddress?: boolean;
}

export const Users: React.FC<UsersProps> = ({ includeUserAddress = true }) => {
  const { values, onChange, reset } = useForm<{ name: string; email: string }>({
    name: '',
    email: '',
  });
  const { book, loading: bookLoading, error: bookError } = useBook();
  const {
    users,
    error,
    loading: usersLoading,
  } = useUsers({
    variables: { includeAddress: includeUserAddress },
  });

  const {
    createUser,
    loading: submitting,
    error: createUserError,
    reset: resetCreateUser,
  } = useCreateUser({
    onCompleted: () => {
      reset();
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(error, null, 2));
    },
    update: (cache, { data }) => {
      const result = data?.createUser;
      if (!result) return;
      const currentUsers = cache.readQuery<UsersQuery>({
        query: usersQuery,
      });

      const users = currentUsers?.users;
      if (!users) return;

      cache.writeQuery<UsersQuery>({
        query: usersQuery,
        data: {
          users: [...users, result],
        },
      });
    },
  });

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    await createUser({
      variables: {
        input: { name: values.name, email: values.email },
      },
    });
  };

  if (error?.graphQLErrors.length) {
    return (
      <div className={styles.usersResponse}>Graphql error: {error.graphQLErrors[0].message}</div>
    );
  }

  if (error?.networkError) {
    return <div className={styles.usersResponse}>Network error: {error.networkError?.message}</div>;
  }

  const usersList = usersLoading ? (
    <div className={styles.usersResponse}>Loading users...</div>
  ) : (
    <div className={styles.userGrid}>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  const bookContent = bookLoading ? (
    <div className={styles.usersResponse}>Loading books...</div>
  ) : (
    <pre className={styles.usersCodeBlock}>
      {bookError ? (
        <code>{JSON.stringify(bookError, null, 2)}</code>
      ) : (
        <>
          <h3>Title: {book?.title}</h3>
          <code>{JSON.stringify(book, null, 2)}</code>
        </>
      )}
    </pre>
  );

  return (
    <div className={styles.userContainer}>
      <form onSubmit={handleSubmit}>
        {createUserError?.graphQLErrors.length && (
          <div className={styles.errorContainer}>
            {createUserError?.graphQLErrors.map((error) => (
              <p>{error.message}</p>
            ))}
            <button onClick={resetCreateUser}>X</button>
          </div>
        )}
        <h3>Create user</h3>
        <div className={styles.formControl}>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={values.name} onChange={onChange} />
        </div>
        <div className={styles.formControl}>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="text" value={values.email} onChange={onChange} />
        </div>
        <button className={styles.submitBtn} type="submit">
          {submitting ? 'Loading...' : 'Create user'}
        </button>
      </form>
      {usersList}
      {bookContent}
    </div>
  );
};
