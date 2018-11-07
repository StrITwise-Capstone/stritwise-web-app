import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class Index extends Component {
  render() {
    return (
      <React.Fragment>
        <Button color="primary" variant="contained">hello</Button>
        <Button color="secondary" variant="contained">hello</Button>
        <Button color="default" variant="contained">hello</Button>

        <p>hi</p>
      </React.Fragment>
    );
  }
}

export default Index;
