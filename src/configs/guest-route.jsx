import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { authService } from "@/data";

export const GuestRoute = (props) => {

  // const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();
  if(isAuthenticated) return <Navigate to="/dashboard/mytryout" />;

  return props.children;
};

export default GuestRoute;
