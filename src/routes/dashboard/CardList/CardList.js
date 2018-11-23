import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';

import EventCard from '../Card/EventCard'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
});

const cardList = (props) => {
  const {
    classes,
    eventsList,
  } = props;

  return (
    <div className={classes.root}>
      <div style={{ margin: '0 auto' }}/>
      <Grid
        container
        spacing={24}
        justify="space-evenly"
        alignItems="center"
      >
        {eventsList
          && Object.keys(eventsList).map(eventuid => (
            <Grid item>
              <EventCard event={eventsList[eventuid]} eventuid={eventuid}/>
            </Grid>))
          }
      </Grid>
    </div>
  );
}

cardList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(cardList);
