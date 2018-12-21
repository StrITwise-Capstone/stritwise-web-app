
import React from 'react';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core/';

import RouteButton from './RouteButton/RouteButton';

const ButtonList = ({ eventuid, userType}) => (
  <div>
    {userType === 'teacher' && <RouteButton route="Register" routelink="register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Participants" routelink="register" eventuid={eventuid} />}
    {userType === 'admin' && <RouteButton route="Edit Event" routelink="edit" eventuid={eventuid} />}
  </div>
);

export default ButtonList;