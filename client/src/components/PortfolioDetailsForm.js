import React from "react";

import { Row, Col, Card, Form, FormControl, InputGroup } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

function PortfolioDetailsForm(props) {
  //TODO: validation, portfolio initial value
  // this is a React hook, works for functional components, like this one.

  const formik = useFormik({
    initialValues: {
      portfolioName: null,
      initialValue: null,
    },
    // need to pass in current asset symbols in portfolio for validation
    // this is probably not the best way to do it.
    //validate: (values) => validate(values, props.assetSymbols),
    validationSchema: Yup.object({
      // TODO: max string length? empty string?
      portfolioName: Yup.string()
        .required("Required")
        .typeError("Must be a string of characters")
        .min(1, "Must have at least one character"),
      // TODO: check for overflow... is zero okay?
      initialValue: Yup.number()
        .required("Required")
        .typeError("Must be a number")
        .min(0, "Must be between 0 and 1 trillion")
        .max(1_000_000_000_000, "Must be between 0 and 1 trillion"),
    }),
    onSubmit: (values) => {
      props.submitAction(values);
      console.log(formik.isValid, values);
    },
  });

  // `name` in a Form.Control (like HTML's <input>) identifies what the
  // variable's name is in the form. It must be the same with what Formik knows.
  return (
    // panels are now cards in Bootstrap 4, they have no padding by default
    <Card className="m-2">
      <Card.Header>Edit portfolio details</Card.Header>
      <Card.Body>
        <Form
          onSubmit={formik.handleSubmit}
          // also submit when form is blurred
          onBlur={formik.handleSubmit}
        >
          <Form.Group as={Row}>
            <Form.Label column md="3">
              Portfolio name
            </Form.Label>
            <Col md="5">
              <InputGroup className="mr-sm-2">
                <Form.Control
                  id="inputPortfolioName"
                  name="portfolioName"
                  placeholder="e.g. test1"
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
            {formik.touched.symbol && formik.errors.symbol ? (
              <Col md="4">{formik.errors.portfolioName}</Col>
            ) : null}
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column md="3">
              Initial value
            </Form.Label>
            <Col md="5">
              <InputGroup className="mr-sm-2">
                <InputGroup.Prepend>
                  <InputGroup.Text>USD</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  id="inputInitialValue"
                  name="initialValue"
                  placeholder="e.g. 1000"
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
            {formik.touched.proportion && formik.errors.proportion ? (
              <Col md="4">{formik.errors.initialValue}</Col>
            ) : null}
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PortfolioDetailsForm;
