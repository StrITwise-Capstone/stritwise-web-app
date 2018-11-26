import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Test from './test';
import SignUp from './auth/signup';
import Login from './auth/login';
import Users from './users';
import EditUser from './users/EditUser';
import AddUser from './users/AddUser';
import Forgot from './auth/forgot';
import NotFound from '../components/Error/404';
import Dashboard from './events';
import CreateEvent from './events/create';
import EditEvent from './events/edit';
import RegisterEvent from './events/register';

const routes = () => {
  const elements = [];

  /* AUTH */
  elements.push(<Route exact path="/" key="/" component={Login} />);
  elements.push(<Route exact path="/auth" key="/auth" component={Login} />);
  elements.push(<Route exact path="/auth/login" key="/auth/login" component={Login} />);
  elements.push(<Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />);
  elements.push(<Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />);

  /* Users */
  elements.push(<Route exact path="/users" component={Users} />);
  elements.push(<Route exact path="/users/:id/edit" component={EditUser} />);
  elements.push(<Route exact path="/users/create" component={AddUser} />);


  /* OTHERS */
  elements.push(<Route exact path="/test" key="/test" component={Test} />);
  elements.push(<Route exact path="/events" key="/events" component={Dashboard} />);
  elements.push(<Route exact path="/events/create" key="/events/create" component={CreateEvent} />);
  elements.push(<Route exact path="/events/:id/edit" key="/events/edit" component={EditEvent} />);
  elements.push(<Route exact path="/events/:id/register" key="/events/register" component={RegisterEvent} />);

  /* ERRORS */ 
  elements.push(<Route path="/" key="/404" component={NotFound} />);

  return (
    <Switch>
      {elements}
    </Switch>
  );
};

export default routes;
