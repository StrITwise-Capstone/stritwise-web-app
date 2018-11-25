import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from '@material-ui/core/Button';

const RouteButton = withRouter(({ history, route, eventuid }) => (
  <Button
    type="button"
    onClick={() => { history.push(`/${route.replace(' ', '').toLowerCase()}?event=${eventuid}`); }}
    size="small"
    color="primary"
  >
    {route}
  </Button>
));

export default RouteButton;
