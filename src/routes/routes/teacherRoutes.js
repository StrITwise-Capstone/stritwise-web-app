import React from 'react';
import {
  Route,
} from 'react-router-dom';

import Dashboard from '../events';
import ViewTeam from '../events/teams/view';
import CreateTeam from '../events/teams/create';
import Profile from '../profile';

export default [

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,
  /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/:id/teams/view" key="/events/teams/view" component={ViewTeam} />,
  <Route exact path="/events/:id/teams/create" key="/events/teams/create"  component={CreateTeam}/>,

]