import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { AuthContext } from './context/auth.context';

const PrivateRoute = () => {
  const { currentUser } = useContext(AuthContext);

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('lastVisitedPage', location.pathname);
  }, [ location ]);

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return !!currentUser ? <Outlet/> : <Navigate to='/login'/>;
};

export default PrivateRoute;
