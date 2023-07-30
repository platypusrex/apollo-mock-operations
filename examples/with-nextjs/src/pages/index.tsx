import NextLink from 'next/link';
import { Users } from '@examples/common';
import { mergeProps } from 'next-merge-props';
import { getServerSideApolloMockedProps } from '@apollo-mock-operations/core';
import { getServerSideApolloProps } from '../lib/apollo';
import { mockInstance } from '../lib/mocks/builder';

const UsersPage = () => (
  <Users
    link={({ name, id }) => (
      <NextLink href={{ pathname: '/user/[id]', query: { id } }}>{name}</NextLink>
    )}
  />
);

export const getServerSideProps = mergeProps(
  // @ts-ignore TODO: typing issue with mockInstance and ssr function input signature
  getServerSideApolloMockedProps(mockInstance),
  getServerSideApolloProps({
    hydrateQueries: ['users', 'book'],
  })
);

export default UsersPage;
