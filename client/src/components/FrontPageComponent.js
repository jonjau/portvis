import React from "react";
import { Row, Jumbotron, Button, Container } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import "../App.css";

function FrontPageComponent() {
  const history = useHistory();
  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="vertical-center">
        <Jumbotron className="col-lg-10 offset-1 float-md-center text-center">
          <h1>What if I had X dollars in stocks Y and Z from dates A to B?</h1>
          <hr></hr>
          <p>
            <Button
              variant="info btn-lg"
              onClick={() => history.push("/portfolios/")}
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
