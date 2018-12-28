import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Dashboard from '../events';
import RegisterEvent from '../events/register';
import CreateStudents from '../events/register/create';
import Profile from '../profile';

export default [

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,
  /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/:id/teams/register" key="/events/register" component={RegisterEvent} />,
  <Route exact path="/events/:id/teams/create" key="/events/teams/create" component={CreateStudents}/>,

]