import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

import LoginForm from './LoginForm';
import Container from '../Container';

class Login extends Component {
  render() {
    const { enqueueSnackbar } = this.props;
    enqueueSnackbar('StrITwise® Web Console v0.1.0', {
      variant: 'info',
    });

    return (
      <Container label="Sign In">
        <LoginForm />
      </Container>
    );
  }
}

Login.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(Login);
