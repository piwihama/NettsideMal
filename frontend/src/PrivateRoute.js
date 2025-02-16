import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import UseAuth from './UseAuth';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const isAuthenticated = UseAuth();
  return isAuthenticated ? <Route {...rest} element={<Element />} /> : <Navigate to="/" />;
};

export default PrivateRoute;
