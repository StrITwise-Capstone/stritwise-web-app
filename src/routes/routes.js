import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Test from './test';
import SignUp from './auth/signup';
import Login from './auth/login';
import NotFound from '../components/Error/404';

const routes = () => {
  const elements = [];

  /* AUTH */
  elements.push(<Route path="/" exact component={Login} />);
  elements.push(<Route path="/auth" exact component={Login} />);
  elements.push(<Route path="/auth/login" component={Login} />);
  elements.push(<Route path="/auth/signup" component={SignUp} />);

  /* OTHERS */
  elements.push(<Route path="/test" component={Test} />);

  /* ERRORS */
  elements.push(<Route path="/" component={NotFound} />);

  return (
    <Switch>
      {elements}
    </Switch>
  );
};

export default routes;