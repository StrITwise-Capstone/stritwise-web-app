import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Users from '../users';
import EditUser from '../users/edit';
import createUser from '../users/create';
import Dashboard from '../events';
import CreateEvent from '../events/create';
import EditEvent from '../events/edit';
import RegisterEvent from '../events/register';
import CreateStudents from '../events/register/create';
import Profile from '../profile';

export default [
  /* USERS */
  <Route exact path="/users" key="/users" component={Users} />,
  <Route exact path="/users/:id/edit" key="/users/edit" component={EditUser} />,
  <Route exact path="/users/create" key="/users/create" component={createUser} />,

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,

    /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/create" key="/events/create" component={CreateEvent} />,
  <Route exact path="/events/:id/edit" key="/events/edit" component={EditEvent} />,

  <Route exact path="/events/:id/teams/register" key="/events/register" component={RegisterEvent} />,
  <Route exact path="/events/:id/teams/create" key="/events/teams/create" component={CreateStudents}/>,

]