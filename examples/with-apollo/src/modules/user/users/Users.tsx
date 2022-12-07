import React, { FormEvent } from 'react';
import { useForm } from '../../../hooks/useForm';
import { useUsers } from '../../../hooks/useUsers';
import { useBook } from '../../../hooks/useBook';
import { useCreateUser } from '../../../hooks/useCreateUser';
import { usersQuery } from '../../../gql';
import { UserCard } from './UserCard';
import styles from './Users.module.css';

export interface UsersProps {
  foo?: 'bar';
}

interface CreateUserFormValues {
  name: string;
  email: string;
}
const initialFormState: CreateUserFormValues = {
  name: '',
  email: '',
};

export const Users: React.FC<UsersProps> = () => {
  const { values, onChange, reset } = useForm<CreateUserFormValues>(initialFormState);
  const { book, loading: bookLoading } = useBook();
  const { users, error, loading: usersLoading } = useUsers();

  const { createUser, loading: submitting } = useCreateUser({
    onCompleted: () => {
      reset();
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
    return <div>Graphql error: {error.graphQLErrors[0].message}</div>;
  }

  if (error?.networkError) {
    return <div>Network error: {error.networkError?.message}</div>;
  }

  const usersList = usersLoading ? (
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
      Loading users...
    </div>
  ) : (
    <div className={styles.userGrid}>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );

  const bookContent = bookLoading ? (
    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
      Loading books...
    </div>
  ) : (
    <pre className={styles.usersCodeBlock}>
      <h3>Title: {book?.title}</h3>
      <code>{JSON.stringify(book, null, 2)}</code>
    </pre>
  );

  return (
    <div className={styles.userContainer}>
      <form onSubmit={handleSubmit}>
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
