import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from"react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";

import RegisterComponent from "./RegisterComponent";
import StockComponent from "./StockComponent";
import BacktestComponent from "./BacktestComponent";
import PortfolioComponent from "./PortfolioComponent";
import NavigationBar from "./NavigationBar";

import SearchService from "../service/SearchService";
import LoginService from "../service/LoginService";
import AboutComponent from "./AboutComponent";
import FrontPageComponent from "./FrontPageComponent";

import { ALPHAVANTAGE_API_KEY } from "../constants";
import { useEffect } from "react";

// class PrivateRoute extends Component {
//   constructor(props) {
//     super();
//   }

//   componentDidUpdate() {
//     LoginService.isLoggedIn().then((response) => {
//       console.log(response);
//     }).catch((e) => console.log(e));
//   }

//   render() {
//     return true ? <Route {...this.props}/> : <Redirect to="/login/"/>
//   }
// }

function PrivateRoute({...props}) {

  useEffect(() => {
    LoginService.isLoggedIn().then(response => {
        console.log("checked login");
        props.setUsername(response.data.username)
        props.setIsLoggedIn(true);
    }).catch(e => console.log(e));
  }, [props]);

  return props.isLoggedIn === null
    ? <h1>wait</h1>
    : props.isLoggedIn
      ? <Route {...props}/>
      : <Redirect to="/login/"/>
}

function PortvisApp() {
  const [searchedStock, setSearchedStock] = useState(null);
  const [apiKey, setApiKey] = useState(ALPHAVANTAGE_API_KEY);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [username, setUsername] = useState("");

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
            <Route path="/login/" component={RegisterComponent} />
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
              path="/backtest/"
              render={(props) => (
                <BacktestComponent username={username} {...props}/>
              )}
              // {/* component={BacktestComponent} */}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/portfolios/"
              render={(props) => (
                <PortfolioComponent username={username} {...props}/>
              )}
              // {/* component={PortfolioComponent} */}
            />
            <PrivateRoute
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              username={username}
              setUsername={setUsername}
              path="/about/"
              render={(props) => (
                <AboutComponent
                  setApiKey={setApiKey}
                  apiKey={apiKey}
                  username={username}
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
