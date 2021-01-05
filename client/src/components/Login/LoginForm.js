import React, { useState } from "react";

import { Row, Col, Button, Form, InputGroup } from "react-bootstrap";

import { useFormik } from "formik";
import * as Yup from "yup";

// TODO: consider TypeScript Enums
const LOGIN = "login";
const REGISTER = "register";

function LoginForm(props) {
  const [passwordShow, setPasswordShow] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      submissionType: LOGIN,
    },

    validationSchema: Yup.object({
      username: Yup.string()
        .required("Required")
        .typeError("Must be a string of characters")
        .min(1, "Must be between 1 to 255 characters")
        .max(255, "Must be between 1 to 255 characters"),

      password: Yup.string()
        .required("Required")
        .typeError("Must be a string of characters")
        .min(1, "Must be between 1 to 255 characters")
        .max(255, "Must be between 1 to 255 characters"),
    }),

    onSubmit: (values) => {
      if (values.submissionType === REGISTER) {
        props.registerAction({
          username: values.username,
          password: values.password,
        });
      } else if (values.submissionType === LOGIN) {
        props.loginAction({
          username: values.username,
          password: values.password,
        });
      }
    },
    enableReinitialize: true,
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Form.Group as={Row}>
        <Form.Label column md="2">
          Username
        </Form.Label>
        <Col md="5">
          <InputGroup className="mr-sm-2">
            <Form.Control
              id="inputUsername"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
          </InputGroup>
        </Col>
        {formik.touched.username && formik.errors.username ? (
          <Col md="4">{formik.errors.username}</Col>
        ) : null}
      </Form.Group>
      <Form.Group as={Row}>
        <Form.Label column md="2">
          Password
        </Form.Label>
        <Col md="5">
          <InputGroup className="mr-sm-2">
            <Form.Control
              id="inputPassword"
              name="password"
              type={passwordShow ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            <InputGroup.Append>
              <InputGroup.Text>Show</InputGroup.Text>
              <InputGroup.Checkbox
                onClick={() => setPasswordShow(!passwordShow)}
              />
            </InputGroup.Append>
          </InputGroup>
        </Col>
        {formik.touched.password && formik.errors.password ? (
          <Col md="4">{formik.errors.password}</Col>
        ) : null}
      </Form.Group>
      <Button
        type="submit" // so ENTER to submit form works
        value="login"
        className="m-2"
        variant="primary"
        onClick={() => {
          formik.setFieldValue("submissionType", LOGIN).then(() => {
            formik.handleSubmit();
          });
        }}
      >
        Login
      </Button>
      <Button
        value="register"
        className="m-2"
        variant="secondary"
        onClick={() => {
          formik.setFieldValue("submissionType", REGISTER).then(() => {
            formik.handleSubmit();
          });
        }}
      >
        Register
      </Button>
    </Form>
  );
}

export default LoginForm;
