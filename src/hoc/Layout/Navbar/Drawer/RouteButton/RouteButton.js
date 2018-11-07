import React from 'react';
import { withRouter } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const RouteButton = withRouter(({ history, route, routelink }) => (
  <Button
    type="button"
    onClick={() => { history.push(`/${routelink}`); }}
  >
    {route}
  </Button>
));

export default RouteButton;
