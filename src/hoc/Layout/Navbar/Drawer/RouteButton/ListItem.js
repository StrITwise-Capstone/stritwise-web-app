import React from 'react';
import { withRouter } from 'react-router-dom';
import { 
  Home,
  Label,
  Schedule,
  AccountBox
} from '@material-ui/icons';
import {
  ListItemIcon,
  ListItem,
  ListItemText,
} from '@material-ui/core';

const RouteButton = withRouter(({ history, route, routelink, onClick, selected }) => {
  const label = () =>{
    if (route === "Home"){
      return <Home style={{margin:'2px', color:'purple'}}/>
    }
    else if (route === "Events"){
      return <Schedule style={{margin:'2px',fill:'purple'}}/>
    }
    else if (route === "Users"){
      return <AccountBox style={{margin:'2px',fill:'purple'}}/>
    }
    else
      return <Label style={{margin:'2px', color:'purple'}}/>
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
