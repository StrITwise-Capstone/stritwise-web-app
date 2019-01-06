import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Form from './Form/Form';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "white",
    paddingLeft:'10px',
  },
});

class SimpleExpansionPanel extends Component {
    render(){
    const { classes, student, teamuid, studentuid, eventuid, deletevalue } = this.props;
    return (
      <div className={classes.root}>
        {student && <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ "backgroundColor":"purple", padding:"5px"}}>
            <Typography className={classes.heading}>{student.first_name} {student.last_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Form student={student} eventuid={eventuid} studentuid={studentuid} teamuid={teamuid} deletevalue={deletevalue}/>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        }
        <div style={{ padding:"10px"}}/>
      </div>
    );
}
}
export default withStyles(styles)(SimpleExpansionPanel);