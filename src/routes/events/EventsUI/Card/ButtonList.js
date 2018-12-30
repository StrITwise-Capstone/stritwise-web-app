
import React from 'react';
import RouteButton from './RouteButton/RouteButton';

const ButtonList = ({ eventuid, userType}) => (
  <div>
    {userType === 'teacher' && <RouteButton route="Register" routelink="teams/register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Participants" routelink="teams/register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Edit Event" routelink="edit" eventuid={eventuid} />}
  </div>
);

export default ButtonList;