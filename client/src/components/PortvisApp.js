import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//import "./PortvisApp.css";
import "bootstrap/dist/css/bootstrap.min.css";

import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import NavigationBar from "./NavigationBar";

class PortvisApp extends Component {
  render() {
    return (
      <Router>
        <>
          <NavigationBar />
          <Switch>
            <Route path="/" exact component={StockComponent} />
            <Route path="/backtest" exact component={BacktestComponent} />
          </Switch>
          <footer>footer</footer>
        </>
      </Router>
    );
  }
}

// <Route render={() => <h1>404: page not found</h1>} />
export default PortvisApp;
