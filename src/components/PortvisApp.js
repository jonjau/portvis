import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "./PortvisApp.css";

import StockComponent from "./StockComponent";

class PortvisApp extends Component {
  render() {
    return (
      <Router>
        <>
          <h1>PORTVIS</h1>
          <ul>
            <li>
              <a class="active" href="#home">
                Home
              </a>
            </li>
            <li>
              <a href="#news">News</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
          <Switch>
            <Route path="/" exact component={StockComponent} />
          </Switch>
        </>
      </Router>
    );
  }
}

export default PortvisApp;
