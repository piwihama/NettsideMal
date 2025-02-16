import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from './UseAuth';

const AuthGuard = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
