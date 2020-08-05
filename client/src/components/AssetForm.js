import React from "react";

import {
  Row,
  Col,
  Button,
  Card,
  Form,
  FormControl,
  InputGroup,
} from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

function AssetForm(props) {
  //TODO: validation, portfolio initial value
  // this is a React hook, works for functional components, like this one.
  const formik = useFormik({
    initialValues: {
      symbol: "",
      proportion: "",
    },
    validationSchema: Yup.object({
      symbol: Yup.string()
        .required("Required")
        .typeError("Must be a string of characters")
        .test(
          "duplicate-asset-test",
          `Asset already exists in portfolio`,
          function (value) {
            // true if valid, false if error
            //FIXME: message not appearing
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
      props.submitAction({
        symbol: values.symbol,
        proportion: Number(values.proportion),
      });
    },
    enableReinitialize: true
  });

  // `name` in a Form.Control (like HTML's <input>) identifies what the
  // variable's name is in the form. It must be the same with what Formik knows.
  return (
    // panels are now cards in Bootstrap 4, they have no padding by default
    <Card className="m-2">
      <Card.Header>Add assets to portfolio</Card.Header>
      <Card.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column md="4">
              Ticker symbol
            </Form.Label>
            <Col md="4">
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
              <Col md="4">{formik.errors.symbol}</Col>
            ) : null}
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column md="4">
              Allocation proportion
            </Form.Label>
            <Col md="4">
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
              <Col md="4">{formik.errors.proportion}</Col>
            ) : null}
          </Form.Group>

          <Button type="submit" className="bg-info mb-2">
            Add asset
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default AssetForm;
