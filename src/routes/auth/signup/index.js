import React, { Component } from 'react';
import { withFirestore } from 'react-redux-firebase';

import SignUpForm from './SignUpForm';
import Container from '../Container';

class SignUp extends Component {
  state = {
    schools: [],
  }

  componentDidMount() {
    const { firestore } = this.props;
    firestore.collection('schools').get().then((querySnapshot) => {
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({
          label: doc.data().name,
          value: doc.id,
        });
      });
      this.setState({ schools });
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    const { schools } = this.state;
    return (
      <Container label="Register as a teacher">
        <SignUpForm schools={schools} />
      </Container>
    );
  }
}

export default withFirestore(SignUp);
