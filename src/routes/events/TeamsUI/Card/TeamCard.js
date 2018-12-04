import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  Typography,
  List,
  Divider,
} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { withRouter } from 'react-router';
import _ from 'lodash';

import ExpansionPanel from './ExpansionPanel/ExpansionPanel';

const styles = {
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: 'cover',
  },
  progress: {
    padding: '30% 45%',
  },
  textField: {
    'word-wrap': 'break-word',
    overflow: 'auto',
    'text-align': 'center',
  },
};

class teamCard extends React.Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({
      open: true,
    });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, event,currentevent, team, studentsList, eventuid, teamuid , history, minStudent } = this.props;
    const { open } = this.state;
    let i = 1;
    return (
      <React.Fragment>
        {team
          && (
            <Card style={{ width: '700px', height: '500px' }}>
              <CardContent className={classes.cardActionArea} onClick={this.handleClickOpen} style={{height:'450px'}}>
                <CardContent>
                  <Typography variant="h5" component="h2" className={classes.textField}>
                    {team.team_name}
                  </Typography>
                </CardContent>
                <Divider/>
                <CardContent style={{height:'300px'}}>
                  <List>
                <div style={{"overflowY":"auto", "maxHeight":"350px",}}>
                {studentsList 
                  && Object.keys(studentsList).map(student => 
                (
                  <React.Fragment key={student}>
                    <ExpansionPanel student={studentsList[student]} teamuid={teamuid} studentuid={student} eventuid={eventuid} deletevalue={currentevent.min_student ? Object.keys(studentsList).length > currentevent.min_student+1 : true }/>
                  </React.Fragment>
                ))
                }
                </div>
                  </List>
                </CardContent>
              </CardContent>
            </Card>
            )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
      team: state.firestore.data.team,
      studentsList: state.firestore.data.studentsList,
      currentevent: state.firestore.data.currentevent,
  }
};

export default compose(withRouter,firestoreConnect((props) => {return [
  {
      collection:'events', doc:`${props.eventuid}`, subcollections: [{collection:'teams', doc:`${props.teamuid}`}], storeAs: 'team'
  },
  {
    collection:'events', doc:`${props.eventuid}`, subcollections: [{collection:'teams', doc:`${props.teamuid}`, subcollections: [{collection: 'students'}]}], storeAs: 'studentsList'
  },
  {
    collection:'events',doc:`${props.eventuid}`,storeAs:`currentevent`
  }
  ]}),connect(mapStateToProps),withStyles(styles))(teamCard);

