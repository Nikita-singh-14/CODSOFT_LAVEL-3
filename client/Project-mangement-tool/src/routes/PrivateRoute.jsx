import React, {useContext} from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../context/userContex';

const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const { user } = useContext(UserContext);
  const userRole = user?.role;

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

