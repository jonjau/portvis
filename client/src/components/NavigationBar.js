import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

import StockSearch from "./StockSearch";

function NavigationBar(props) {

  return (
    <Navbar sticky="top" bg="dark" variant="dark">
      <LinkContainer to="/">
        <Navbar.Brand>Portvis</Navbar.Brand>
      </LinkContainer>
      <Nav className="mr-auto">
        <LinkContainer to="/stocks/">
          <Nav.Link>Stocks</Nav.Link>
        </LinkContainer>
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
      <StockSearch handleStockSearch={props.handleStockSearch}/>
    </Navbar>
  );
}

export default NavigationBar;
