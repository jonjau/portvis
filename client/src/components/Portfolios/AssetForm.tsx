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
import { Allocation } from "../../models/Portfolio";

interface Props {
  assetSymbols: string[];
  totalAllocation: number;
  submitAction: (newAsset: Allocation) => void;
}

const AssetForm = (props: Props) => {
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
          (submittedSymbol: string | null | undefined ): boolean => {
            // if somehow submittedSymbol is not actually a string, just force
            // a fail by checking for a nonsensical symbol.
            // true if valid, false if error
            return !props.assetSymbols.includes(submittedSymbol ?? "");
          }
        ),
      proportion: Yup.number()
        .required("Required")
        .typeError("Must be a number")
        .min(0, "Must be between 0 and 1")
        .max(1, "must be between 0 and 1")
        .test(
          "allocation-limit-test",
          `Total allocation proportion must not exceed 100% of portfolio`,
          (submittedProportion: number | null | undefined): boolean => {
            // if somehow submittedProportion is not actually a number, just
            // force a fail by defaulting to 2 (anything larger than 1.0).
            // true if valid, false if error
            return props.totalAllocation + (submittedProportion ?? 2) <= 1.0;
          }
        ),
    }),
    onSubmit: (values) => {
      props.submitAction({
        symbol: values.symbol,
        proportion: Number(values.proportion),
      });
    },
    enableReinitialize: true,
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
