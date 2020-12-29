import React, { useState } from "react";
import { Row, Container, Jumbotron, Modal, Button } from "react-bootstrap";

import RegisterService from "../service/RegisterService";
import LoginService from "../service/LoginService";
import LoginForm from "./LoginForm";

function LoginComponent(props) {
  const [isModalShown, setIsModalShown] = useState(false);
  const [message, setMessage] = useState("");

  const handleModalClose = () => {
    setIsModalShown(false);
  };

  const register = (username, password) =>
    RegisterService.register(username, password)
      .then((_response) => {
        login(username, password);
      })
      .catch((error) => {
        // TODO: assuming all errors mean "username already taken"...
        // error code 422 should be used for "duplicate username", instead of
        // 500
        setIsModalShown(true);
        setMessage("Failed to register: Username already taken.");
      });

  const login = (username, password) =>
    LoginService.login(username, password)
      .then((_response) => {
        props.history.push("/portfolios/");
      })
      .catch((_error) => {
        setIsModalShown(true);
        setMessage("Failed to login: Invalid credentials.");
      });

  return (
    <>
      <Row className="bg-secondary min-vh-100">
        <Container className="vertical-center">
          <Jumbotron className="col-lg-10 offset-1 mx-auto text-center">
            <LoginForm submitAction={login} register={register} />
          </Jumbotron>
        </Container>
      </Row>

      <Modal show={isModalShown} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleModalClose}>Okay</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginComponent;
