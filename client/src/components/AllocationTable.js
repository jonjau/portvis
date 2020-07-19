import React, { Component } from "react";
import { Table, Button, Form, FormControl, InputGroup } from "react-bootstrap";
import { useFormik } from "formik";
// import BoostrapTable from "react-bootstrap-table-next";
// import cellEditFactory from 'react-bootstrap-table2-editor';

function AssetForm(props) {
  // this is a React hook, works for functional components, like this one.
  const formik = useFormik({
    initialValues: {
      symbol: "NVDA",
      proportion: 0.0,
    },
    onSubmit: (values) => {
      //alert(JSON.stringify(values, null, 2));
      props.submitAction(values);
    },
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

    this.columns = [
      {
        dataField: "symbol",
        text: "Ticker Symbol",
        sort: true,
      },
      {
        dataField: "proportion",
        text: "Allocation Proportion",
        sort: true,
      },
    ];

    this.addAssetClicked = this.addAssetClicked.bind(this);
    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
  }

  addAssetClicked(newAsset) {
    // never mutate state directly!
    this.setState((prevState) => ({
      assets: [...prevState.assets, newAsset],
    }));
  }

  deleteAssetClicked(assetSymbol) {
    // assumes assets (their symbols) are unique
    this.setState((prevState) => ({
      assets: prevState.assets.filter((asset) => asset.symbol !== assetSymbol),
    }));
  }

  render() {
    // doesn't have to be called submitAction
    return (
      <>
        <AssetForm submitAction={this.addAssetClicked} />
        {/* <BoostrapTable
          keyField="name"
          data={this.state.assets}
          columns={this.columns}
          cellEdit={ cellEditFactory({ mode: 'click' }) }
        ></BoostrapTable> */}

        <Table bordered hover className="col-9">
          <thead>
            <tr className="d-flex">
              <th className="col-2">Asset</th>
              <th className="col-4">Proportion</th>
              <th className="col-4">Allocation</th>
              <th className="col-2"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.assets.map((asset) => (
              // symbol must be unique! Validate this with Formik
              // https://reactjs.org/docs/lists-and-keys.html#keys
              <tr className="d-flex" key={asset.symbol}>
                <td className="col-2">{asset.symbol}</td>
                <td className="col-4">{asset.proportion}</td>
                <td className="col-4">lorem ipsum</td>
                <td classname="col-2">
                  <Button
                    className="btn-danger"
                    onClick={() => this.deleteAssetClicked(asset.symbol)}
                  >
                    Delete
                  </Button>
                  {/* <InputGroup>
                  <FormControl>

                  </FormControl>
                  </InputGroup> */}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  }
}

export default AllocationTable;
