import { mergeProps } from 'next-merge-props';
import { getServerSideApolloMockedProps } from '@apollo-mock-operations/core';
import { Users } from '../modules/user/users';
import { getServerSideApolloProps } from '../lib/apollo';

export default Users;

export const getServerSideProps = mergeProps(
  getServerSideApolloMockedProps,
  getServerSideApolloProps({
    hydrateQueries: ['users', 'book'],
  })
);
