import { useRouter } from 'next/router';
import { UserDetail } from '../../modules/user/user-detail';
import { getServerSideApolloProps } from '../../lib/apollo';

const UserDetailPage = () => {
  const {
    query: { id },
  } = useRouter();

  return <UserDetail id={id as string} />;
};

export const getServerSideProps = getServerSideApolloProps({
  hydrateQueries: ['user', 'booksByAuthor'],
});

export default UserDetailPage;
