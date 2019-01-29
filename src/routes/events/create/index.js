import React, { Component } from 'react';

import Form from './AddEventForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

class createEvent extends Component {
  render() {
    return (
      <AdminLayout
        title="Create Event"
      >
        <Form />
      </AdminLayout>
    );
  }
}

export default createEvent;
