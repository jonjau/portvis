import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import { Row, Container, Jumbotron, Spinner } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

import LoginComponent from "./Login/Login";
import StockComponent from "./Stocks";
import BacktestComponent from "./Backtest";
import PortfolioComponent from "./Portfolios/Portfolios";
import NavigationBar from "./NavigationBar/NavigationBar";

import SearchService from "../services/SearchService";
import LoginService from "../services/LoginService";
import About from "./About";
import FrontPageComponent from "./FrontPage";

import { ALPHAVANTAGE_API_KEY } from "../constants";
import { useEffect } from "react";
import Account from "./Account";

const LoadingPage = () => (
  <Row className="bg-secondary min-vh-100">
    <Container className="vertical-center">
      <Jumbotron className="col-4 offset-4 mx-auto text-center">
        <Spinner animation="border" />
      </Jumbotron>
    </Container>
  </Row>
);

const ErrorPage = () => (
  <Row className="bg-secondary min-vh-100">
    <Container className="vertical-center">
      <Jumbotron className="col-6 offset-3 mx-auto text-center">
        <h1>404: Page not found.</h1>
      </Jumbotron>
    </Container>
  </Row>
);

function PrivateRoute({ ...props }) {
  useEffect(() => {
    LoginService.isLoggedIn()
      .then((response) => {
        console.log("checked login");
        props.setUsername(response.data.username);
        props.setIsLoggedIn(true);
      })
      .catch(() => props.setIsLoggedIn(false));
  }, [props]);

  return props.isLoggedIn === null ? (
    <LoadingPage />
  ) : props.isLoggedIn ? (
    <Route {...props} />
  ) : (
    <Redirect to="/login/" />
  );
}

function PortvisApp() {
  // TODO: consider React Context or Redux
  const [searchedStock, setSearchedStock] = useState(null);
  const [apiKey, setApiKey] = useState(ALPHAVANTAGE_API_KEY);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState("");

  function handleStockSearch(symbol) {
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
            <Route path="/" exact component={FrontPageComponent} />
            <Route path="/login/" component={LoginComponent} />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/portfolios/"
              render={(props) => (
                <PortfolioComponent username={username} {...props} />
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
                <BacktestComponent username={username} {...props} />
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
                <StockComponent searchedStock={searchedStock} {...props} />
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
                  setApiKey={setApiKey}
                  apiKey={apiKey}
                  username={username}
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
                  username={username}
                  {...props}
                />
              )}
            />
            <Route
              component={ErrorPage}
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
