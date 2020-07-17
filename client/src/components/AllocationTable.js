import React, { Component } from "react";
import { Table } from "react-bootstrap";

class AllocationTable extends Component {
  render() {
    return (
      <Table striped bordered size="sm" hover variant="dark">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default AllocationTable;
