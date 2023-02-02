import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserDetail } from '@examples/common';

export const UserDetailRoute: React.FC = () => {
  const { id } = useParams();
  return (
    <UserDetail id={id!}>
      <Link to="/">Back to users</Link>
    </UserDetail>
  );
};
