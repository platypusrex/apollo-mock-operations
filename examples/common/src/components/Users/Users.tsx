import React, { FormEvent } from 'react';
import { useForm, useUsers, useBook, useCreateUser } from '../../hooks';
import { usersQuery } from '../../gql';
import { UserCard } from './UserCard';
import { UserFragment, UsersQuery } from '../../typings';

interface UsersProps {
  // prop that controls the @include directive on the user fragment
  includeUserAddress?: boolean;
  link?: (user: UserFragment) => React.ReactNode;
}

export const Users: React.FC<UsersProps> = ({ includeUserAddress = true, link }) => {
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
      <div className="response">Graphql error: {error.graphQLErrors[0].message}</div>
    );
  }

  if (error?.networkError) {
    return <div className="response">Network error: {error.networkError?.message}</div>;
  }

  const usersList = usersLoading ? (
    <div className="response">Loading users...</div>
  ) : (
    <div className="card-grid">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} link={link} />
      ))}
    </div>
  );

  const bookContent = bookLoading ? (
    <div className="response">Loading books...</div>
  ) : (
    <pre className="code-block">
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
    <div className="users-container">
      <form onSubmit={handleSubmit}>
        {createUserError?.graphQLErrors.length && (
          <div className="error-container">
            {createUserError?.graphQLErrors.map((error) => (
              <p>{error.message}</p>
            ))}
            <button onClick={resetCreateUser}>X</button>
          </div>
        )}
        <h3>Add author</h3>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" value={values.name} onChange={onChange} />
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="text" value={values.email} onChange={onChange} />
        </div>
        <button className="submit-btn" type="submit">
          {submitting ? 'Loading...' : 'Add author'}
        </button>
      </form>
      <div>
        {usersList}
        {bookContent}
      </div>
    </div>
  );
};
