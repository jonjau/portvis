import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

//import "./PortvisApp.css";
import "bootstrap/dist/css/bootstrap.min.css";

import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import PortfolioComponent from "./PortfolioComponent";
import NavigationBar from "./NavigationBar";

import SearchService from "../service/SearchService";
import AboutComponent from "./AboutComponent";

function PortvisApp() {
  const [searchedStock, setSearchedStock] = useState(null);

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
            <Route path="/" exact render={() => <div>tempo</div>} />
            <Route
              path="/stocks/"
              render={(props) => (
                <StockComponent searchedStock={searchedStock} {...props} />
              )}
            />
            <Route path="/backtest/" component={BacktestComponent} />
            <Route path="/portfolios/" component={PortfolioComponent} />
            <Route path="/about/" component={AboutComponent} />
            <Route
              render={() => (
                <h2 className="text-center">404: Page not found.</h2>
              )}
            />
          </Switch>
        </div>
        <footer className="bg-info">hello my name is footer</footer>
      </Router>
    </>
  );
}

// <Route render={() => <h1>404: page not found</h1>} />
export default PortvisApp;
