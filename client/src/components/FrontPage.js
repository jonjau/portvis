import React from "react";
import { Row, Jumbotron, Button, Container } from "react-bootstrap";
import "../App.css";

function FrontPageComponent(props) {
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="vertical-center">
        <Jumbotron className="col-lg-10 offset-1 float-md-center text-center">
          <h1>What if I held X dollars in stocks Y and Z from dates A to B?</h1>
          <hr></hr>
          <p>
            <Button
              variant="info btn-lg"
              onClick={() => props.history.push("/portfolios/")}
            >
              Good question...
            </Button>
          </p>
        </Jumbotron>
      </Container>
    </Row>
  );
}

export default FrontPageComponent;
