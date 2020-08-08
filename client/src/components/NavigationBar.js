import React from "react";
import { Navbar, Nav, Form, FormControl, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import { AsyncTypeahead } from "react-bootstrap-typeahead";

import StockSearch from "./StockSearch";

function NavigationBar() {


  return (
    <Navbar sticky="top" bg="dark" variant="dark">
      <LinkContainer to="/">
        <Navbar.Brand>Portvis</Navbar.Brand>
      </LinkContainer>
      <Nav className="mr-auto">
        <LinkContainer to="/portfolios/">
          <Nav.Link>Portfolios</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/backtest/">
          <Nav.Link>Backtest</Nav.Link>
        </LinkContainer>
        <LinkContainer to="/about/">
          <Nav.Link>About</Nav.Link>
        </LinkContainer>
      </Nav>
      <StockSearch/>
    </Navbar>
  );
}

export default NavigationBar;
