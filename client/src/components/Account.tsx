import React, { useState, useEffect } from "react";
import { Row, Container, InputGroup, Form, Col, Button } from "react-bootstrap";
import { RouteComponentProps } from "react-router-dom";
import AccountService from "../services/AccountService";

const Account = ({ history }: RouteComponentProps) => {
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    AccountService.getAccountDetails().then((response) => {
      setApiKey(response.data.apiKey);
      setUsername(response.data.username);
    });
  }, []);

  const updateApiKey = () => {
    AccountService.updateAccountDetails({ username, apiKey })
      .catch((_err) => {
        alert("Error in updating api key.");
      });
  };

  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        <Container className="m-3">
          <Col>
            <h4>
              Currently logged in as: <b>{username}</b>
            </h4>
          </Col>
          <Col>
            <Button
              variant="info"
              onClick={() => history.push("/login/")}
            >
              Login as different user
            </Button>
          </Col>
          <div className="mt-3"></div>
          <div>
            <hr></hr>
          </div>
          <div className="m-3">
            <p>The current AlphaVantage API key (edit if necessary):</p>
            <Form.Group as={Row}>
              <Col md="5">
                <InputGroup className="mr-sm-2">
                  <Form.Control
                    id="inputApiKey"
                    name="apiKey"
                    onChange={(event) => setApiKey(event.target.value)}
                    value={apiKey}
                  />
                  <Button variant="success" onClick={updateApiKey}>
                    Save
                  </Button>
                </InputGroup>
              </Col>
            </Form.Group>
            <p>
              Get one
              <a
                href="https://www.alphavantage.co/support/#api-key"
                target="_blank"
                rel="noopener noreferrer"
              >
                &nbsp;here
              </a>
              , or maybe try some random letters and numbers...
            </p>
          </div>
        </Container>
      </Container>
    </Row>
  );
};

export default Account;
