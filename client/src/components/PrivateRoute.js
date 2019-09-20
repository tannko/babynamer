import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLogin } from '../utils/utils';

const PrivateRoute = ({component: Component, ...rest}) => {
  return (
    // Show the component only when user is logged in
    // otherwise redirect to login/signup page
    <Route {...rest} render = { props => (
      isLogin() ?
      <Component {...props} />
      : <Redirect to='/' />
    )} />
  );
};

export default PrivateRoute;
