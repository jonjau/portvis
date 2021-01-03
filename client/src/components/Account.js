import React from "react";
import { Row, Container, InputGroup, Form, Col, Button } from "react-bootstrap";

const Account = (props) => {
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        <Container className="mx-auto m-3">
          <div>
            <h4>
              Currently logged in as: <b>{props.username}</b>
            </h4>
          </div>
          <div className="mt-3">
            <Button onClick={() => props.history.push("/login/")}>
              Login as different user
            </Button>
          </div>
          <div>
            <hr></hr>
          </div>
          <div className="mt-3">
            The current AlphaVantage API key (edit if necessary):
            <Form.Group as={Row}>
              <Col md="5">
                <InputGroup className="mr-sm-2">
                  <Form.Control
                    id="inputPortfolioName"
                    name="portfolioName"
                    onChange={(event) => props.setApiKey(event.target.value)}
                    value={props.apiKey}
                  />
                </InputGroup>
              </Col>
            </Form.Group>
            Get one
            <a
              href="https://www.alphavantage.co/support/#api-key"
              target="_blank"
              rel="noopener noreferrer"
            >
              &nbsp;here
            </a>
            , or maybe try some random letters and numbers...
          </div>
        </Container>
      </Container>
    </Row>
  );
}

export default Account;
