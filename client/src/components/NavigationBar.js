import React from "react";
import { Navbar, Nav } from "react-bootstrap";

function NavigationBar() {
  return (
    <Navbar sticky="top" bg="dark" variant="dark">
      <Navbar.Brand href="/">Portvis</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="backtest">Backtest</Nav.Link>
        <Nav.Link href="monitor">Monitor</Nav.Link>
        <Nav.Link href="about">About</Nav.Link>
      </Nav>
    </Navbar>
  );
}

export default NavigationBar;
