import React from "react";
import { Row, Container, InputGroup, Form, Col } from "react-bootstrap";

function AboutComponent(props) {
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        <Container className="mx-auto m-3">
          <div>
            <b>Portvis</b> is short for portfolio visualiser. Functionalities:
          </div>
          <div className="mt-3">
            <ul>
              <li>Creating, updating, deleting or arbitrary portfolios</li>
              <li>Comparing historical portfolio returns</li>
              <li>Fuzzy stock search</li>
            </ul>
          </div>
          <div className="mt-3">
            Portvis uses the public
            <a href="https://www.alphavantage.co/">&nbsp;AlphaVantage&nbsp;</a>
            stock data API. For serious use, go to
            <a href="https://www.portfoliovisualizer.com/">
              &nbsp;portfoliovisualizer.com
            </a>
            .
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
            <a href="https://www.alphavantage.co/support/#api-key">
              &nbsp;here
            </a>
            , or maybe try some random letters and numbers...
          </div>
        </Container>
      </Container>
    </Row>
  );
}

export default AboutComponent;
