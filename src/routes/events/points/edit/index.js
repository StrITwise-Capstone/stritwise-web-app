import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import {
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import StarIcon from '@material-ui/icons/Stars';

import EditTeamPtsForm from './EditTeamPtsForm';
import AdminLayout from '../../../../hoc/Layout/AdminLayout';

const styles = {
  title: {
    paddingBottom: 20,
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
  },
  pointSpan: {
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
  },
  starIcon: {
    fontSize: 45,
    display: 'inline-block',
    paddingRight: 10,
  },
  points: {
    marginTop: 12,
  },
};

class EditPoints extends Component {
  render() {
    let content = <CircularProgress />;
    const { classes, team, firestore, match } = this.props;
    const teamRef = firestore.collection('events').doc(match.params.eventId).collection('teams').doc(match.params.teamId);
    if (team !== undefined) {
      content = (
        <AdminLayout>
          <Typography variant="h4" id="title" className={classes.title}>Edit Points</Typography>
          <Card>
            <CardContent className={classes.cardContent}>
              <Typography component="h5" variant="h5">
                Team:
                {` ${team.team_name}`}
              </Typography>

              <span className={classes.pointSpan}>
                <StarIcon color="secondary" className={classes.starIcon} />
                <p className={classes.points}>
                  Current Points:
                  {` ${team.credit}`}
                </p>
              </span>
            </CardContent>
          </Card>
          <EditTeamPtsForm teamRef={teamRef} />
        </AdminLayout>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    team: state.firestore.data.team,
  };
};

EditPoints.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.any.isRequired,
  team: PropTypes.any.isRequired,
  match: PropTypes.any.isRequired,
  firestore: PropTypes.any.isRequired,
  /* eslint-enable */
};

EditPoints.defaultProps = {
};
export default compose(
  withRouter,
  firestoreConnect(props => (
    [
      {
        collection: 'events', doc: `${props.match.params.eventId}`, subcollections: [{ collection: 'teams', doc: `${props.match.params.teamId}` }], storeAs: 'team',
      },
    ]
  )),
  connect(mapStateToProps),
  withStyles(styles),
)(EditPoints);
