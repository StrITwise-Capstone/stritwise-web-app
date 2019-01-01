import React from 'react';
import { withRouter } from 'react-router-dom';
import { Home, Label } from '@material-ui/icons';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ListItem from '@material-ui/core/ListItem';

const RouteButton = withRouter(({ history, route, routelink,onClick, selected, children }) => {
  const label = () =>{
    if (route == "Home"){
      return <Home style={{margin:'2px', color:'purple'}}></Home>
    }
    else
      return <Label style={{margin:'2px', color:'purple'}}></Label>
  }
  return(
  <ListItem
    type="button"
    onClick={() => { onClick(); history.push(`/${routelink}`); }}
    color="inherit"
    selected={selected}
  >
    <ListItemIcon>{label()}</ListItemIcon>
    <ListItemText primary={route} />
  </ListItem>
)});

export default RouteButton;
