import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { authService } from "@/data";

export const ProtectedRoute = (props) => {

  // const navigate = useNavigate();

  const isAuthenticated = authService.isAuthenticated();
  if(!isAuthenticated) return <Navigate to="/auth/sign-in" />;

  return props.children;

//   return (
//     <Route {...rest} ></Route>
//   );

  // return (
  //   <Route
  //     {...rest}
  //     render={(props) =>
  //       isAuthenticated ? (
  //         <Component {...props} />
  //       ) : (
  //         <Navigate to="/login" />
  //       )
  //     }
  //   ></Route>
  // );
};

export default ProtectedRoute;
