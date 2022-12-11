import { Users } from '../modules/user/users';
import { getServerSideApolloProps } from '../lib/apollo';

export default Users;

export const getServerSideProps = getServerSideApolloProps({
  hydrateQueries: ['users', 'book'],
});
