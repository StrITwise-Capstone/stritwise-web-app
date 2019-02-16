import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Form from './Form/EditStudentForm';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: 'white',
    paddingLeft: '10px',
  },
});

/**
 * Class representing the Student component.
 * @param {Object} student - A specific student document
 * @param {teamId} teamId - A string of the team Id
 * @param {Function} updatePage - A function to update the page
 * @param {Boolean} deleteValue - A boolean whether can delete Student or not
*/
class Student extends Component {

  render() {
    const {
      classes,
      student,
      teamId,
      deleteValue,
      updatePage,
    } = this.props;
    return (
      <div className={classes.root}>
        {student && (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ backgroundColor: 'purple', padding: '5px' }}>
            <Typography className={classes.heading}>
              {`${student.first_name} ${student.last_name}`}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Form student={student} studentId={student.key} teamId={teamId} deleteValue={deleteValue} updatePage={updatePage} />
          </ExpansionPanelDetails>
        </ExpansionPanel>)
        }
        <div style={{ padding: '10px' }} />
      </div>
    );
  }
}

Student.propTypes = {
  teamId: PropTypes.string.isRequired,
  updatePage: PropTypes.func.isRequired,
  deleteValue: PropTypes.bool.isRequired,
  student: PropTypes.shape({}).isRequired,
  /* eslint-disable react/forbid-prop-types */
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

Student.defaultProps = {
};


export default withStyles(styles)(Student);
