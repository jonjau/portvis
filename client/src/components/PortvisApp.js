import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//import "./PortvisApp.css";
import "bootstrap/dist/css/bootstrap.min.css";

import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import PortfolioComponent from "./PortfolioComponent";
import NavigationBar from "./NavigationBar";

class PortvisApp extends Component {
  render() {
    // TODO: 404 page
    return (
      <>
        <Router>
          <NavigationBar />
          <div className="container-fluid flex-grow-1">
            <Switch>
              {/* some paths DON'T have to be exact in this case */}
              <Route path="/" exact component={StockComponent} />
              <Route path="/backtest" component={BacktestComponent} />
              <Route path="/portfolios" component={PortfolioComponent} />
              {/* <Route
                path={`/portfolios/:portfolioId`}
                render={() => <h3>dsd</h3>}
              /> */}
            </Switch>
          </div>
          <footer className="bg-info">hello my name is footer</footer>
        </Router>
      </>
    );
  }
}

// <Route render={() => <h1>404: page not found</h1>} />
export default PortvisApp;
