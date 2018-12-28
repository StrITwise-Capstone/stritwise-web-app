import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Test from '../test';
import SignUp from '../auth/signup';
import Login from '../auth/login';
import Users from '../users';
import EditUser from '../users/edit';
import AddUser from '../users/create';
import Forgot from '../auth/forgot';
import NotFound from '../../components/Error/404';
import Dashboard from '../events';
import CreateEvent from '../events/create';
import EditEvent from '../events/edit';
import RegisterEvent from '../events/register';
import CreateStudents from '../events/register/create';
import Profile from '../profile';

export default [

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,
  /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/:id/teams/register" key="/events/register" component={RegisterEvent} />,
  <Route exact path="/events/:id/teams/add" key="/events/teams/add" component={CreateStudents}/>,

]