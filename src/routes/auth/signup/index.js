import React, { Component } from 'react';

import SignUpForm from './SignUpForm';
import Container from '../Container';

class SignUp extends Component {
  render() {
    return (
      <Container label="Register as a teacher">
        <SignUpForm />
      </Container>
    );
  }
}

export default SignUp;
