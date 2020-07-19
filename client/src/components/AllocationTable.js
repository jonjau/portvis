import React, { Component } from "react";
import {
  Table,
  Button,
  Form,
  FormControl,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

function validate(values, assetSymbols) {
  const errors = {};
  if (!values.symbol) {
    errors.symbol = "Required";
  } else if (assetSymbols.includes(values.symbol)) {
    errors.symbol = `${values.symbol} already in portfolio`;
  }
  if (!values.proportion) {
    errors.proportion = "Required";
  } else if (!(0.0 <= Number(values.proportion) <= 1.0)) {
    errors.proportion = "Proportion must be a number between 0 and 1";
  }
  return errors;
}

function AssetForm(props) {
  //TODO: validation, portfolio initial value
  // this is a React hook, works for functional components, like this one.
  const formik = useFormik({
    initialValues: {
      symbol: "",
      proportion: "",
    },
    // need to pass in current asset symbols in portfolio for validation
    // this is probably not the best way to do it.
    //validate: (values) => validate(values, props.assetSymbols),
    validationSchema: Yup.object({
      symbol: Yup.string()
        .required("Required")
        .typeError("Must be a string of characters")
        .test(
          "duplicate-asset-test", "Asset already exists in portfolio",
          function(value) {
            // true if valid, false if error
            return !props.assetSymbols.includes(value);
          }
        ),
      proportion: Yup.number()
        .required("Required")
        .typeError("Must be a number")
        .min(0, "Must be between 0 and 1")
        .max(1, "must be between 0 and 1"),
    }),
    onSubmit: (values) => {
      props.submitAction(values);
    },
  });

  // `name` in a Form.Control (like HTML's <input>) identifies what the
  // variable's name is in the form. It must be the same with what Formik knows.
  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group as={Row}>
        <Form.Label column md="2">
          Ticker Symbol
        </Form.Label>
        <Col md="2">
          <InputGroup className="mb-2 mr-sm-2">
            <Form.Control
              id="inputSymbol"
              name="symbol"
              placeholder="e.g. NVDA"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </InputGroup>
        </Col>
        {formik.touched.symbol && formik.errors.symbol ? (
          <div>{formik.errors.symbol}</div>
        ) : null}
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column md="2">
          Allocation Proportion
        </Form.Label>
        <Col md="2">
          <InputGroup className="mb-2 mr-sm-2">
            <FormControl
              id="inputProportion"
              name="proportion"
              placeholder="e.g. 0.8"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </InputGroup>
        </Col>
        {formik.touched.proportion && formik.errors.proportion ? (
          <div>{formik.errors.proportion}</div>
        ) : null}
      </Form.Group>

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
    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
  }

  addAssetClicked(newAsset) {
    // never mutate state directly!
    alert(JSON.stringify(newAsset, null, 2));
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
        <AssetForm
          submitAction={this.addAssetClicked}
          assetSymbols={this.state.assets.map((asset) => asset.symbol)}
        />
        <Table bordered hover className="col-9 table-condensed">
          <thead>
            <tr className="d-flex">
              <th className="col-3">Asset</th>
              <th className="col-3">Proportion</th>
              <th className="col-3">Allocation</th>
              <th className="col-3"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.assets.map((asset) => (
              // symbol must be unique! Validate this with Formik
              // https://reactjs.org/docs/lists-and-keys.html#keys
              <tr className="d-flex" key={asset.symbol}>
                <td className="col-3">{asset.symbol}</td>
                <td className="col-3">{asset.proportion}</td>
                <td className="col-3">lorem ipsum</td>
                <td className="col-3">
                  <Button
                    className="btn-danger"
                    onClick={() => this.deleteAssetClicked(asset.symbol)}
                  >
                    Delete
                  </Button>
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
