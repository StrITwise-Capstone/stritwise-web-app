import React from 'react';
import {
  Route,
} from 'react-router-dom';

import Users from '../users';
import EditUser from '../users/edit';
import createUser from '../users/create';
import Dashboard from '../events';
import CreateEvent from '../events/create';
import EditEvent from '../events/edit';
import ViewTeam from '../events/teams/view';
import CreateTeam from '../events/teams/create';
import RegisterEvent from '../events/register';
import CreateStudents from '../events/register/create';
import Volunteers from '../events/volunteers';
import CreateVolunteer from '../events/volunteers/create';
import EditVolunteer from '../events/volunteers/edit';
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

  <Route exact path="/events/:id/teams/view" key="/events/teams/view" component={ViewTeam} />,
  <Route exact path="/events/:id/teams/create" key="/events/teams/create"  component={CreateTeam}/>,

  <Route exact path="/events/:id/volunteers" key="/events/volunteers/"  component={Volunteers}/>,
  <Route exact path="/events/:id/volunteers/create" key="/events/volunteers/create"  component={CreateVolunteer}/>,
  <Route exact path="/events/:id/volunteers/edit" key="/events/volunteers/edit"  component={EditVolunteer}/>,

]