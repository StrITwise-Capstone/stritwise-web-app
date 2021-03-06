import React from 'react';
import {
  Route,
} from 'react-router-dom';

import Dashboard from '../events';
import ViewTeam from '../events/teams';
import CreateTeam from '../events/teams/create';
import EditTeam from '../events/teams/edit';
import Profile from '../profile';
import Overview from '../events/overview';
import Volunteers from '../events/volunteers';
import CreateVolunteer from '../events/volunteers/create';
import EditVolunteer from '../events/volunteers/edit';
import TeamPoints from '../events/points';
import EditTeamPoints from '../events/points/edit';


export default [

  /*PROFILE */
  <Route exact path="/profile" key="/profile" component={Profile} />,

  /* EVENTS */ 
  <Route exact path="/events" key="/events" component={Dashboard}/>,
  <Route exact path="/events/:eventId/overview" key="/events/overview" component={Overview} />,

  <Route exact path="/events/:eventId/teams/view" key="/events/teams/view" component={ViewTeam} />,
  <Route exact path="/events/:eventId/teams/create" key="/events/teams/create"  component={CreateTeam}/>,

  // teams
  <Route exact path="/events/:eventId/teams" key="/events/teams" component={ViewTeam} />,
  <Route exact path="/events/:eventId/teams/create" key="/events/teams/create" component={CreateTeam}/>,
  <Route exact path="/events/:eventId/teams/:teamId/edit" key="/events/teams/edit" component={EditTeam}/>,
  

  // Volunteers
  <Route exact path="/events/:eventId/volunteers" key="/events/volunteers" component={Volunteers} />,
  <Route exact path="/events/:eventId/volunteers/create" key="/events/volunteers/create" component={CreateVolunteer} />,
  <Route exact path="/events/:eventId/volunteers/:volunteerid/edit" key="/events/volunteers/edit" component={EditVolunteer} />,

  // PointSystem
  <Route exact path="/events/:eventId/points" key="/events/points" component={TeamPoints} />,
  <Route exact path="/events/:eventId/points/:teamId/edit" key="/events/points/edit" component={EditTeamPoints} />,

]