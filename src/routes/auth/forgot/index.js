import React, { Component } from 'react';

import ForgotForm from './ForgotForm';
import Container from '../Container';

class Forgot extends Component {
  render() {
    return (
      <Container label="Sign In">
        <ForgotForm />
      </Container>
    );
  }
}

export default Forgot;
