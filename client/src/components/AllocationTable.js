import React, { Component } from "react";
import { Table, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";

function AssetForm(props) {

  // this is a React hook, works for functional components, like this one.
  const formik = useFormik({
    initialValues: {
      symbol: "NVDA",
      proportion: 0.0,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
      props.submitAction(values);
    }
  });

  // `name` in a Form.Control (like HTML's <input>) identifies what the
  // variable's name is in the form. It must be the same with what Formik knows.
  return (
    <Form inline onSubmit={formik.handleSubmit}>
      <InputGroup className="mb-2 mr-sm-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Ticker Symbol</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          id="inputSymbol"
          name="symbol"
          value={formik.values.symbol}
          onChange={formik.handleChange}
        />
      </InputGroup>
      <InputGroup className="mb-2 mr-sm-2">
        <InputGroup.Prepend>
          <InputGroup.Text>Allocation Proportion</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          id="inputProportion"
          name="proportion"
          value={formik.values.proportion}
          onChange={formik.handleChange}
        />
      </InputGroup>
      <Button type="submit" className="bg-info mb-2">
        Add asset
      </Button>
    </Form>
  );
}

class AllocationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      assets: [],
    };

    this.addAssetClicked = this.addAssetClicked.bind(this);
  }

  addAssetClicked(values) {
    // no stale state issue?
    console.log(this.state.assets);
    const newAssets = this.state.assets.concat(values)
    console.log(newAssets);
    this.setState({assets: newAssets});
  }

  render() {
    console.log("rendered")
    // doesn't have to be called submitAction
    return (
      <>
        <AssetForm submitAction={this.addAssetClicked}/>
        <Table bordered hover className="col-9">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Proportion</th>
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {this.state.assets.map((asset) => (
              // symbol must be unique! Validate this with Formik
              // https://reactjs.org/docs/lists-and-keys.html#keys
              <tr key={asset.symbol}>
                <td>{asset.symbol}</td>
                <td>{asset.proportion}</td>
                <td>lorem ipsum</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export default AllocationTable;
