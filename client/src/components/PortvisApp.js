import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import Login from "./Login/Login";
import Stocks from "./Stocks";
import Backtest from "./Backtest/Backtest";
import Portfolios from "./Portfolios/Portfolios";
import NavigationBar from "./NavigationBar/NavigationBar";

import SearchService from "../services/SearchService";
import LoginService from "../services/LoginService";
import About from "./About";
import FrontPage from "./FrontPage";

import { useEffect } from "react";
import Account from "./Account";
import Loading from "./Loading";
import Error from "./Error";

const PrivateRoute = ({ ...props }) => {
  useEffect(() => {
    LoginService.isLoggedIn()
      .then((response) => {
        props.setUsername(response.data.username);
        props.setIsLoggedIn(true);
      })
      .catch(() => props.setIsLoggedIn(false));
  }, [props]);

  return props.isLoggedIn === null ? (
    <Loading />
  ) : props.isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Redirect to="/login/" />
  );
}

const PortvisApp = () => {
  // TODO: consider React Context or Redux
  const [searchedStock, setSearchedStock] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState("");

  const handleStockSearch = (symbol) => {
    SearchService.getCompany(symbol)
      .then((response) => {
        console.log(response.data);
        if (!response.data.symbol) {
          // if stock not found, back end will send 200 with null fields.
          alert("Stock not found.")
        } else {
          setSearchedStock(response.data);
        }
      });
  }

  // refactor the PrivateRoute stuff soon
  return (
    <>
      <Router>
        <NavigationBar handleStockSearch={handleStockSearch} />
        <div className="container-fluid flex-grow-1">
          <Switch>
            {/* some paths DON'T have to be exact in this case */}
            <Route path="/" exact component={FrontPage} />
            <Route path="/login/" component={Login} />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/portfolios/"
              render={(props) => (
                <Portfolios username={username} {...props} />
              )}
              // {/* component={PortfolioComponent} */}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/backtest/"
              render={(props) => (
                <Backtest username={username} {...props} />
              )}
              // {/* component={BacktestComponent} */}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/stocks/"
              render={(props) => (
                <Stocks searchedStock={searchedStock} {...props} />
              )}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/account/"
              render={(props) => (
                <Account
                  {...props}
                />
              )}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/about/"
              render={(props) => (
                <About
                  {...props}
                />
              )}
            />
            <Route
              component={Error}
            />
          </Switch>
        </div>
        <footer className="bg-dark text-center">
          <a
            className="text-white"
            href="https://github.com/jonjau/portvis"
            target="_blank"
            rel="noopener noreferrer"
          >
            source code
          </a>
        </footer>
      </Router>
    </>
  );
}

export default PortvisApp;
