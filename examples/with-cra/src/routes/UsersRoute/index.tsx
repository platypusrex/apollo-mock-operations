import React from 'react';
import { Users } from '@examples/common';
import { Link } from 'react-router-dom';

export const UsersRoute: React.FC = () => (
  <Users
    link={(user) => (
      <Link to={`user/${user.id}`}>
        {user.name}
      </Link>
    )}
  />
);
