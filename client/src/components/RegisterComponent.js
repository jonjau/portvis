import React, { useState } from "react";
import { Row, Container, InputGroup, Form, Col, Button } from "react-bootstrap";

import RegisterService from "../service/RegisterService";
import LoginService from "../service/LoginService";
import PasswordShowHide from "./PasswordShowHide";

function RegisterComponent(props) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = (username, password) =>
    RegisterService.register(username, password)
      .then(response => console.log(response.data))
      .catch(error => console.log(error));

  const login = (username, password) =>
    LoginService.login(username, password)
      .then(response => {
        console.log(response);
        // localStorage.setItem("token", response.data.jwtToken);
      })
      .catch(error => console.log(error));

  const isLoggedIn = (username, password) =>
    LoginService.isLoggedIn()
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));

  // TODO: username and password constraints: min length etc.
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        <Container className="mx-auto m-3">
          <Form.Group as={Row}>
            <Col md="5">
              <InputGroup className="mr-sm-2">
                <Form.Control
                  onChange={(event) => setUsername(event.target.value)}
                />
              </InputGroup>
              <PasswordShowHide password={password} setPassword={setPassword}/>
              <Button onClick={() => register({username, password})}>
                register
              </Button>
              <Button onClick={() => login({username, password})}>
                login
              </Button>
              <Button onClick={() => isLoggedIn({username, password})}>
                is-logged-in
              </Button>
              <Button onClick={() => console.log(localStorage.getItem('token'))}>
                getToken
              </Button>
            </Col>
          </Form.Group>
        </Container>
      </Container>
    </Row>
  );
}

export default RegisterComponent;
