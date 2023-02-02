import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UsersRoute } from './routes/UsersRoute';
import { UserDetailRoute } from './routes/UserDetailRoute';
import '@examples/common/common.css';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UsersRoute />} />
        <Route path="/user/:id" element={<UserDetailRoute />} />
      </Routes>
    </Router>
  );
};
