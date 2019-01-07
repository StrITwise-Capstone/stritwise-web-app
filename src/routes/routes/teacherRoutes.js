import React from 'react';
import {
  Route,
} from 'react-router-dom';

import Dashboard from '../events';
import ViewTeam from '../events/teams/view';
import CreateTeam from '../events/teams/create';
import Profile from '../profile';
import Overview from '../events/overview';
import EditTeam from '../events/teams/edit';

export default [

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,
  /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/:id/teams" key="/events/teams" component={ViewTeam} />,
  <Route exact path="/events/:id/teams/create" key="/events/teams/create"  component={CreateTeam}/>,
  <Route exact path="/events/:id/teams/:teamid/edit" key="/events/teams/edit" component={EditTeam}/>,
  <Route exact path="/events/:id/overview" key="/events/overview" component={Overview} />,


]