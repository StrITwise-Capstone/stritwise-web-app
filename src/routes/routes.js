import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Test from './test';
import SignUp from './auth/signup';
import Login from './auth/login';
import Users from './users';
import EditUser from './users/edit';
import AddUser from './users/create';
import Forgot from './auth/forgot';
import NotFound from '../components/Error/404';
import Dashboard from './events';
import CreateEvent from './events/create';
import EditEvent from './events/edit';
import RegisterEvent from './events/register';
import CreateStudents from './events/register/create';
import Profile from './profile'

const routes = () => {
  const elements = [];

  /* AUTH */
  elements.push(<Route exact path="/" key="/" component={Login} />);
  elements.push(<Route exact path="/auth" key="/auth" component={Login} />);
  elements.push(<Route exact path="/auth/login" key="/auth/login" component={Login} />);
  elements.push(<Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />);
  elements.push(<Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />);

  /* USERS */
  elements.push(<Route exact path="/users" key="/users" component={Users} />);
  elements.push(<Route exact path="/users/:id/edit" key="/users/edit" component={EditUser} />);
  elements.push(<Route exact path="/users/create" key="/users/create" component={AddUser} />);

  /*PROFILE */
  elements.push(<Route exact path="/profile" key="/profile" component={Profile} />);
  /* OTHERS */
  elements.push(<Route exact path="/test" key="/test" component={Test} />);

  /* EVENTS */ 
  elements.push(<Route exact path="/events" key="/events" component={Dashboard} />);
  elements.push(<Route exact path="/events/create" key="/events/create" component={CreateEvent} />);
  elements.push(<Route exact path="/events/:id/edit" key="/events/edit" component={EditEvent} />);
  elements.push(<Route exact path="/events/:id/register" key="/events/register" component={RegisterEvent} />);
  elements.push(<Route exact path="/events/:id/register/create" key="/events/register/create" component={CreateStudents}/>)
  /* ERRORS */
  elements.push(<Route path="/" key="/404" component={NotFound} />);

  return (
    <Switch>
      {elements}
    </Switch>
  );
};

export default routes;
