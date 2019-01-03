
import React from 'react';
import RouteButton from './RouteButton/RouteButton';
import {
Button,
} from '@material-ui/core/';

const ButtonList = ({ eventuid, userType, deleteEvent}) => (
  <div>
    {userType === 'teacher' && <RouteButton route="Register" routelink="teams/register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Participants" routelink="teams/register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Crews" routelink="crews" eventuid={eventuid} />}
    <div/>
    {userType === 'admin' && <RouteButton route="Edit" routelink="edit" eventuid={eventuid} />}
    {userType === 'admin' && <Button size="small" color="primary" onClick={deleteEvent}>Delete</Button>}
  </div>
);

export default ButtonList;