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

export default 
[
  <Route exact path="/" key="/" component={Login} />,
  <Route exact path="/auth" key="/auth" component={Login} />,
  <Route exact path="/auth/login" key="/auth/login" component={Login} />,
  <Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />,
  <Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />,
]