import React, { Component } from "react";
import { Table, Button, Form, FormControl, InputGroup } from "react-bootstrap";

class AllocationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: [],
    };
    this.addAssetClicked = this.addAssetClicked.bind(this);
  }

  addAssetClicked() {}

  render() {
    return (
      <>
        <Form inline onSubmit={() => this.addAssetClicked()}>
          <InputGroup className="mb-2 mr-sm-2">
            <Form.Control
              id="inlineFormInputSymbol"
              placeholder="Enter ticker symbol"
            />
          </InputGroup>
          <InputGroup className="mb-2 mr-sm-2">
            <FormControl
              id="inlineFormInputAllocation"
              placeholder="Enter allocation proportion"
            />
          </InputGroup>
          <Button type="submit" className="bg-info mb-2">
            Add
          </Button>
        </Form>

        {/* <Container fluid="true" className="d-flex flex-column"> */}
        <Table bordered hover className="col-8">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Proportion</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {this.state.assets.map((asset) => (
              <tr>
                <td>{asset.name}</td>
                <td>{asset.weight}</td>
                <td>{asset.allocation}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* </Container> */}
      </>
    );
  }
}

export default AllocationTable;
