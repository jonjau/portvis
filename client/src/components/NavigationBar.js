import React from "react";
import { Navbar, Nav, Form, Button, FormControl } from "react-bootstrap";

function NavigationBar() {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Portvis</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="backtest">Backtest</Nav.Link>
        <Nav.Link href="features">Features</Nav.Link>
        <Nav.Link href="pricing">Pricing</Nav.Link>
      </Nav>
      <Form inline>
        <FormControl
          type="text"
          placeholder="Lorem Ipsum"
          className="mr-sm-2"
        />
        <Button variant="outline-info">Lorem Ipsum</Button>
      </Form>
    </Navbar>
  );
}

export default NavigationBar;
