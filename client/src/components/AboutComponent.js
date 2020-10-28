import React from "react";
import { Row, Container } from "react-bootstrap";

function AboutComponent() {
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        <Container className="m-5">
          <div>Portvis is short for portfolio visualiser. Functionalities:</div>
          <div className="mt-3">
            <ul>
              <li>Creating, updating, deleting or arbitrary portfolios</li>
              <li>Comparing historical portfolio returns</li>
              <li>Fuzzy stock search</li>
            </ul>
          </div>
          <div>
            Portvis uses the public
            <a href="https://www.alphavantage.co/">
              &nbsp;AlphaVantage&nbsp;
            </a>
            stock API. For serious use, go to
            <a href="https://www.portfoliovisualizer.com/">
              &nbsp;portfoliovisualizer.com
            </a>
            .
          </div>
        </Container>
      </Container>
    </Row>
  );
}

export default AboutComponent;
