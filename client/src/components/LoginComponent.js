import React from "react";
import { Row, Container, Jumbotron } from "react-bootstrap";

import RegisterService from "../service/RegisterService";
import LoginService from "../service/LoginService";
import LoginForm from "./LoginForm";
import { useHistory } from "react-router-dom";

function LoginComponent(props) {
  const history = useHistory();

  const register = (username, password) =>
    RegisterService.register(username, password)
      .then((response) => {
        login(username, password);
      })
      .catch((error) => alert("Failed to register"));

  const login = (username, password) =>
    LoginService.login(username, password)
      .then((response) => {
        history.push("/portfolios/");
      })
      .catch((error) => alert("Failed to login"));

  const isLoggedIn = (username, password) =>
    LoginService.isLoggedIn()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.log(error));

  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="vertical-center">
        <Jumbotron className="col-lg-10 offset-1 mx-auto text-center">
          <LoginForm submitAction={login} register={register} />
        </Jumbotron>
      </Container>
    </Row>
  );
}

export default LoginComponent;
