import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import PortfolioComponent from "./PortfolioComponent";
import NavigationBar from "./NavigationBar";

import SearchService from "../service/SearchService";
import AboutComponent from "./AboutComponent";
import FrontPageComponent from "./FrontPageComponent";

import { ALPHAVANTAGE_API_KEY } from "../constants";

function PortvisApp() {
  const [searchedStock, setSearchedStock] = useState(null);
  const [apiKey, setApiKey] = useState(ALPHAVANTAGE_API_KEY);

  function handleStockSearch(symbol) {
    SearchService.getCompany(symbol)
      .then((response) => {
        setSearchedStock(response.data);
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
    // FIXME: if stock not found, need to fail: fix this in the back end
  }

  return (
    <>
      <Router>
        <NavigationBar handleStockSearch={handleStockSearch} />
        <div className="container-fluid flex-grow-1">
          <Switch>
            {/* some paths DON'T have to be exact in this case */}
            <Route path="/" exact component={FrontPageComponent} />
            <Route
              path="/stocks/"
              render={(props) => (
                <StockComponent searchedStock={searchedStock} {...props} />
              )}
            />
            <Route path="/backtest/" component={BacktestComponent} />
            <Route path="/portfolios/" component={PortfolioComponent} />
            <Route
              path="/about/"
              render={(props) => (
                <AboutComponent
                  setApiKey={setApiKey}
                  apiKey={apiKey}
                  {...props}
                />
              )}
            />
            <Route
              render={() => (
                <h2 className="text-center">404: Page not found.</h2>
              )}
            />
          </Switch>
        </div>
        <footer className="bg-dark text-center">
          <a className="text-white" href="https://github.com/jonjau/portvis"
             target="_blank"  rel="noopener noreferrer">
            source code
          </a>
        </footer>
      </Router>
    </>
  );
}

export default PortvisApp;
