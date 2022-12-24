import { mergeProps } from 'next-merge-props';
import { useRouter } from 'next/router';
import { getServerSideApolloMockedProps } from '@apollo-mock-operations/core';
import { UserDetail } from '../../modules/user/user-detail';
import { getServerSideApolloProps } from '../../lib/apollo';

const UserDetailPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <UserDetail id={id as string} />;
};

export const getServerSideProps = mergeProps(
  getServerSideApolloMockedProps,
  getServerSideApolloProps({
    hydrateQueries: ['user', 'booksByAuthor'],
  })
);

export default UserDetailPage;
