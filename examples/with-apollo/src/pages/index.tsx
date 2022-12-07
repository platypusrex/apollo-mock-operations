import { Users } from '../modules/user/users';
import { getServerSideApolloProps } from '../lib/apollo';

// eslint-disable-next-line import/no-default-export
export default Users;

export const getServerSideProps = getServerSideApolloProps({
  hydrateQueries: ['users', 'book'],
});
