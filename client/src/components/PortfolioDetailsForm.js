import React from "react";

import { Row, Col, Card, Form, FormControl, InputGroup } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

function PortfolioDetailsForm(props) {
  // this is a React hook, basically state for functional components
  const formik = useFormik({
    // initial values are derived from props
    initialValues: {
      portfolioName: props.currentPortfolio.name,
      initialValue: props.currentPortfolio.initialValue,
    },

    validationSchema: Yup.object({
      // max length of 255 is arbitrary, and likely still excessive.
      portfolioName: Yup.string()
        .typeError("Must be a string of characters")
        .max(255, "Must be 255 characters or less"),

      // zero is fine: no division by initial portfolio value in the backend.
      // 1 billion should also be fine, as Java's double can
      // accomodate much larger numbers.
      initialValue: Yup.number()
        .required("Required")
        .typeError("Must be a number")
        .min(0, "Must be between 0 and 1 billion")
        .max(1_000_000_000, "Must be between 0 and 1 billion"),
    }),

    onSubmit: (values) => {
      // convert initial value to number before passing it on to submitAction
      props.submitAction({
        portfolioName: values.portfolioName,
        initialValue: Number(values.initialValue),
      });
    },

    // tell Formik to reset the form whenever initial values change
    enableReinitialize: true,
  });

  // `name` in a Form.Control (like HTML's <input>) identifies what the
  // variable's name is in the form. It must be the same with what Formik knows.
  return (
    // panels are now cards in Bootstrap 4, they have no padding by default.
    <Card className="m-2">
      <Card.Header>Edit portfolio details</Card.Header>
      <Card.Body>
        <Form onBlur={formik.handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column md="3">
              Portfolio name
            </Form.Label>
            <Col md="5">
              <InputGroup className="mr-sm-2">
                <Form.Control
                  id="inputPortfolioName"
                  name="portfolioName"
                  value={formik.values.portfolioName}
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
            {formik.touched.portfolioName && formik.errors.portfolioName ? (
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
                  value={formik.values.initialValue}
                  onChange={formik.handleChange}
                />
              </InputGroup>
            </Col>
            {formik.touched.initialValue && formik.errors.initialValue ? (
              <Col md="4">{formik.errors.initialValue}</Col>
            ) : null}
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PortfolioDetailsForm;
