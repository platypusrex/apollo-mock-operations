import React from 'react';
import NextLink from 'next/link';
import { useUser } from '../../../hooks/useUser';
import { useBooksByAuthor } from '../../../hooks/useBooksByAuthor';
import styles from './UserDetail.module.css';

interface UserDetailProps {
  id: string;
}

export const UserDetail: React.FC<UserDetailProps> = ({ id }) => {
  const { user, error } = useUser({
    variables: { id },
  });

  const { books } = useBooksByAuthor({
    variables: { authorId: id },
  });

  if (error?.graphQLErrors.length) {
    return (
      <div className={styles.userResponse}>GraphQL error: {error.graphQLErrors[0]?.message}</div>
    );
  }

  if (error?.networkError) {
    return <div className={styles.userResponse}>Network error: {error.networkError.message}</div>;
  }

  if (!user) {
    return <div className={styles.userResponse}>User not found...:(</div>;
  }

  return (
    <div className={styles.userDetailContainer}>
      <div className={styles.userContainer}>
        <NextLink href="/">Back to users</NextLink>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
      </div>
      <div className={styles.bookGrid}>
        {books?.map((book) => (
          <div key={book.id} className={styles.bookCard}>
            <h3>{book.title}</h3>
            <p>Number of pages: {book.numPages}</p>
            <pre className={styles.bookCodeBlock}>
              <code>{JSON.stringify(book, null, 2)}</code>
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};
