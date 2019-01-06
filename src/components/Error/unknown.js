import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = () => ({
  progress: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginBottom: '-50px',
  },
});

class Unknown extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    this.timeoutHandle = setTimeout(() => {
      history.push('/404');
    }, 3000);
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CircularProgress className={classes.progress} />
      </React.Fragment>
    );
  }
}

Unknown.propTypes = {
  /* eslint-disable react/forbid-prop-types */
  history: PropTypes.any.isRequired,
  classes: PropTypes.any.isRequired,
  /* eslint-enable */
};

export default withStyles(styles)(withRouter(Unknown));
