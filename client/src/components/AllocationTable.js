import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";

class AllocationTable extends Component {
  render() {
    return (
      <Table bordered size="md" hover>
        <thead>
          <tr>
            <th>Asset</th>
            <th>Weighting</th>
            <th>Allocation</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
        </tbody>
      </Table>
    );
  }
}

export default AllocationTable;
