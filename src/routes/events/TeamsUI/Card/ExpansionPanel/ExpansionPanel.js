import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';

import Form from './Form/Form';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color: "white",
  },
});

class SimpleExpansionPanel extends React.Component {

    render(){
    const { classes, student, teamuid, studentuid, eventuid, deletevalue } = this.props;

    return (
      <div className={classes.root}>
        {student && <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} style={{ "background-color":"purple", padding:"5px"}}>
            <Typography className={classes.heading} style={{"padding-left":"10px"}}>{student.first_name} {student.last_name}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
              {deletevalue}
          <Form student={student} eventuid={eventuid} studentuid={studentuid} teamuid={teamuid} deletevalue={deletevalue}/>
          </ExpansionPanelDetails>
          <ExpansionPanelActions>
          </ExpansionPanelActions>
        </ExpansionPanel>
        }
        <div style={{ padding:"10px"}}/>
      </div>
    );
}
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(SimpleExpansionPanel);