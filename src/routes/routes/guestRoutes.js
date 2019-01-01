import React from 'react';
import {
  Route,
} from 'react-router-dom';

import SignUp from '../auth/signup';
import Login from '../auth/login';
import Forgot from '../auth/forgot';

export default 
[
  <Route exact path="/" key="/" component={Login} />,
  <Route exact path="/auth" key="/auth" component={Login} />,
  <Route exact path="/auth/login" key="/auth/login" component={Login} />,
  <Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />,
  <Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />,
]