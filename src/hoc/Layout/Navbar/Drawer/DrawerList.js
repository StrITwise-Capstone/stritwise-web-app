import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from 'prop-types';

import RouteList from './RoutesList/RouteList';
import RouteButton from './RouteButton/RouteButton';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

const DrawerList = ({ auth }) => {
  const resultList = RouteList.filter(obj => obj.name === auth);
  return (
    <div>
      <List>
        <ListItem key="Home">
          <RouteButton route="Home" routelink="" />
        </ListItem>
        { auth
          && resultList[0].route.map(key => (
            <ListItem key={key}>
              <RouteButton route={key} routelink={key.replace(' ', '').toLowerCase()} />
            </ListItem>
          ))
        }
      </List>
    </div>
  );
};

DrawerList.propTypes = {
  auth: PropTypes.string.isRequired,
};
export default withStyles(styles)(DrawerList);
