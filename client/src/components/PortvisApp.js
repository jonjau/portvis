import React, { Component } from "react";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

//import "./PortvisApp.css";
import "bootstrap/dist/css/bootstrap.min.css";

import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import PortfolioComponent from "./PortfolioComponent";
import NavigationBar from "./NavigationBar";

import SearchService from "../service/SearchService";

class PortvisApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchedStock: null,
    };

    this.handleStockSearch = this.handleStockSearch.bind(this);
  }

  handleStockSearch(symbol) {
    SearchService.getCompany(symbol)
      .then((response) => {
        this.setState({ searchedStock: response.data });
      })
      .catch();
      //FIXME:
  }

  render() {
    // TODO: 404 page
    return (
      <>
        <Router>
          <NavigationBar handleStockSearch={this.handleStockSearch} />
          <div className="container-fluid flex-grow-1">
            <Switch>
              {/* some paths DON'T have to be exact in this case */}
              <Route path="/" exact render={() => <div>tempo</div>} />
              <Route
                path="/stocks/"
                render={(props) => (
                  <StockComponent
                    searchedStock={this.state.searchedStock}
                    {...props}
                  />
                )}
              />
              <Route path="/backtest/" component={BacktestComponent} />
              <Route path="/portfolios/" component={PortfolioComponent} />
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
