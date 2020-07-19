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
      <>
        <NavigationBar />
        <div className="container-fluid flex-grow-1">
          <Router>
            <Switch>
              <Route path="/" exact component={StockComponent} />
              <Route path="/backtest" exact component={BacktestComponent} />
            </Switch>
          </Router>
        </div>
      </>
    );
  }
}

// <Route render={() => <h1>404: page not found</h1>} />
export default PortvisApp;
