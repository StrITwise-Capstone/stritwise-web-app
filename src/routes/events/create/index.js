import React, { Component } from 'react';

import Form from './AddEventForm';
import AdminLayout from '../../../hoc/Layout/AdminLayout';

/**
 * Class representing the addEvent component.
 */
class addEvent extends Component {
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

export default addEvent;
