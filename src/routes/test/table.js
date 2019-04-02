import React, { Component } from 'react';
import { TableCell } from '@material-ui/core';

import CustomTable from '../../components/UI/Table/Table';

const data = [
  {
    id: '1', name: 'Terry', mobile: '342132', gender: 'male',
  },
  {
    id: '2', name: 'heda', mobile: '434254435', gender: 'female',
  },
];

class TestTable extends Component {

  handleEdit = () => {

  }

  handleDelete = () => {

  }

  render() {
    return (
      <div>
        <CustomTable
          data={data}
          handleEdit={this.handleEdit}
          handleDelete={this.handleDelete}
        >
          <TableCell>Name</TableCell>
          <TableCell>Mobile</TableCell>
          <TableCell>Gender</TableCell>
        </CustomTable>
      </div>
    );
  }
}

export default TestTable;
