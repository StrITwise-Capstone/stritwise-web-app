import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import { Label } from '@material-ui/icons';

import RouteList from './RoutesList/RouteList';
import ListItemButton from './RouteButton/ListItem';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
};

class DrawerList extends Component {
  state = {
    selectedIndex: null,
  }

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index });
  };

  render() {
    const { auth } = this.props;
    const { selectedIndex } = this.state;
    const resultList = RouteList.filter(obj => obj.name === auth);
    return (
      <div>
        <List>
          { auth
            && resultList[0].route.map((key, index) => (
              <ListItemButton
                key={index}
                selected={selectedIndex === index + 1}
                route={key}
                routelink={key.replace(' ', '').toLowerCase()}
                onClick={event => this.handleListItemClick(event, index + 1)}
              >
                {Label}
              </ListItemButton>
            ))
          }
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(DrawerList);
