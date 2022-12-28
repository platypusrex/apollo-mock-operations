import React from 'react';
import { useUser, useBooksByAuthor } from '../../hooks';

interface UserDetailProps {
  id: string;
  children?: React.ReactNode;
}

export const UserDetail: React.FC<UserDetailProps> = ({ id, children }) => {
  const { user, error } = useUser({
    variables: { id },
  });

  const { books } = useBooksByAuthor({
    variables: { authorId: id },
  });

  if (error?.graphQLErrors.length) {
    return (
      <div className="response">GraphQL error: {error.graphQLErrors[0]?.message}</div>
    );
  }

  if (error?.networkError) {
    return <div className="response">Network error: {error.networkError.message}</div>;
  }

  if (!user) {
    return <div className="response">User not found...:(</div>;
  }

  return (
    <div className="user-detail-container">
      <div className="user-container">
        {children}
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      <div className="card-grid">
        {books?.map((book) => (
          <div key={book.id} className="card">
            <h3>{book.title}</h3>
            <p>Number of pages: {book.numPages}</p>
            <pre className="code-block">
              <code>{JSON.stringify(book, null, 2)}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
