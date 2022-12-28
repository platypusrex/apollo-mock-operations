import NextLink from 'next/link';
import { UserDetail } from '@examples/common';
import { useRouter } from 'next/router';
import { mergeProps } from 'next-merge-props';
import { getServerSideApolloMockedProps } from '@apollo-mock-operations/core';
import { getServerSideApolloProps } from '../../lib/apollo';

const UserDetailPage = () => {
  const {
    query: { id },
  } = useRouter();

  return (
    <UserDetail id={id as string}>
      <NextLink href="/">Back to users</NextLink>
    </UserDetail>
  );
};

export const getServerSideProps = mergeProps(
  getServerSideApolloMockedProps,
  getServerSideApolloProps({
    hydrateQueries: ['user', 'booksByAuthor'],
  })
);

export default UserDetailPage;
