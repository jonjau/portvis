import React, { Component } from "react";
import { ListGroup, Row, Col, Button, Nav } from "react-bootstrap";
import AllocationTable from "./AllocationTable";
import PortfolioService from "../service/PortfolioService";
import { Route, Switch, Link } from "react-router-dom";
import Test from "./Test";
import _ from "lodash";

class PortfolioComponent extends Component {
  // FIXME: type coercion of allocation proportions!! "0.5" becomes 1...
  // FIXME: clean up types in general, a lot of numeric IDs are strings now
  constructor(props) {
    super(props);

    this.state = {
      portfolios: new Map(),
      currentPortfolioId: this.props.match.params.portfolioId,
      // unused:
      isLoading: true,
    };
    //console.log(this.props);
    this.refreshPortfolios = this.refreshPortfolios.bind(this);
    this.getCurrentPortfolio = this.getCurrentPortfolio.bind(this);

    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
    this.addAssetClicked = this.addAssetClicked.bind(this);
    this.portfolioDetailsSubmitted = this.portfolioDetailsSubmitted.bind(this);

    this.savePortfolioClicked = this.savePortfolioClicked.bind(this);
    this.deletePortfolioClicked = this.deletePortfolioClicked.bind(this);
    this.addPortfolioClicked = this.addPortfolioClicked.bind(this);
  }

  componentDidMount() {
    this.refreshPortfolios();
  }

  componentDidUpdate() {}

  getCurrentPortfolio(portfolioId) {
    // assumes portfolioId is a NUMBER and portfolioId's are unique
    const currentPortfolio = this.state.portfolios.filter(
      (portfolio) => portfolio.id === portfolioId
    )[0];
    // console.log(
    //   `portfolio comp currport: ${JSON.stringify(currentPortfolio, null, 2)}`
    // );
    return currentPortfolio;
  }

  refreshPortfolios() {
    PortfolioService.getAllPortfolios()
      .then((response) => {
        //console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
        // make a map so lookup by id is easier
        this.setState({
          portfolios: new Map(response.data.map((p) => [p.id, p])),
          isLoading: false,
        });
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
  }

  addAssetClicked(newAsset) {
    // never mutate state directly!
    const { symbol, proportion } = newAsset;
    const currId = this.state.currentPortfolioId;
    const newPortfolios = new Map(this.state.portfolios);

    newPortfolios.get(currId).allocations[symbol] = proportion;

    this.setState({ portfolios: newPortfolios });
  }

  deleteAssetClicked(assetSymbol) {
    // assumes assets (their symbols) are unique
    const currId = this.state.currentPortfolioId;
    const newPortfolios = new Map(this.state.portfolios);
    delete newPortfolios.get(currId).allocations[assetSymbol];

    this.setState({ portfolios: newPortfolios });
  }

  portfolioDetailsSubmitted(portfolioDetails) {
    const { portfolioName, initialValue } = portfolioDetails;
    const currId = this.state.currentPortfolioId;
    const newPortfolios = new Map(this.state.portfolios);

    newPortfolios.get(currId).name = portfolioName;
    newPortfolios.get(currId).initialValue = initialValue;

    console.log("details submitted");

    this.setState({
      name: portfolioDetails.portfolioName,
      initialValue: portfolioDetails.initialValue,
    });
  }

  savePortfolioClicked() {
    const currId = this.state.currentPortfolioId;
    PortfolioService.updatePortfolio(currId, this.state.portfolios.get(currId))
      .then((response) => {
        if (!_.isEqual(response.data, this.state.portfolios.get(currId))) {
          console.log(response.data);
          console.log(this.state.portfolios.get(currId));
          alert("Portfolio was not succesfully updated.");
        }
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to save this portfolio.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  deletePortfolioClicked() {
    const currId = this.state.currentPortfolioId;
    PortfolioService.deletePortfolio(currId)
      .then((response) => {
        if (response.data.deleted === true) {
          this.setState({ currentPortfolioId: null });
          this.props.history.push(`/portfolios/`);
        } else {
          alert("Portfolio was not successfully deleted.");
        }
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to delete this portfolio.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  addPortfolioClicked() {
    const newPortfolio = {name:"", initialValue:0, allocations:{}};
    PortfolioService.addPortfolio(newPortfolio).then((response) => {
      if (!_.has(newPortfolio, "id")) {
        const currId = newPortfolio.id;
        this.setState({ currentPortfolioId: currId });
        this.props.history.push(`/portfolios/${currId}`);
      } else {
          alert("Portfolio was not successfully created.");
      }
      this.refreshPortfolios();
    })
    .catch((error) => {
      alert("An error occurred when trying to add a new portfolio.");
      console.log(`error: ${JSON.stringify(error, null, 2)}`);
    });
  }

  render() {
    const { match, location } = this.props;
    // this.state.portfolios.forEach((portfolio, _) => {
    //   console.log(portfolio);
    // });

    return (
      <Row>
        <Col md={2} className="bg-secondary p-2 vh-100">
          <Nav
            as={ListGroup}
            activeKey={location.pathname}
            className="flex-column"
          >
            {Array.from(this.state.portfolios.values()).map((portfolio) => (
              <Nav.Link
                as={ListGroup.Item}
                variant="dark"
                action
                key={portfolio.id}
                eventKey={`/${portfolio.id}`}
                onClick={() => {
                  this.setState({ currentPortfolioId: portfolio.id });
                  this.props.history.push(`/portfolios/${portfolio.id}`);
                }}
              >
                {portfolio.name} ({portfolio.id})
              </Nav.Link>
            ))}
            {/* <Nav.Link
              as={ListGroup.Item}
              variant="dark"
              action
              eventKey="/1"
              onClick={() => {
                this.setState({ currentPortfolioId: 1 });
                this.props.history.push(`/portfolios/1`);
              }}
            >
              Portfolio 1<Link to={`${match.url}/1`}>aa</Link>
            </Nav.Link> */}

            {/* <Nav.Link
              as={ListGroup.Item}
              variant="dark"
              action
              eventKey="/2"
              onClick={() => {
                this.setState({ currentPortfolioId: 2 });
                this.props.history.push(`/portfolios/2`);
              }}
            >
              Portfolio 2<Link to={`${match.url}/2`}>aa</Link>
            </Nav.Link> */}
            <Nav.Link as={ListGroup.Item} variant="dark" action>
              Link
            </Nav.Link>
            <ListGroup.Item disable="true" variant="secondary">
              <Button className="btn-info" onClick={this.addPortfolioClicked}>
                Add new portfolio
              </Button>
            </ListGroup.Item>
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          {this.state.currentPortfolioId && !this.state.isLoading ? (
            <>
              <Route
                path={`${this.props.match.path}/:portfolioId`}
                render={(props) => (
                  // instead of using higher order components, we can do this
                  // to pass some (not all!) props to a Component
                  <AllocationTable
                    portfolioDetailsSubmitted={this.portfolioDetailsSubmitted}
                    deleteAssetClicked={this.deleteAssetClicked}
                    addAssetClicked={this.addAssetClicked}
                    currentPortfolio={this.state.portfolios.get(
                      this.state.currentPortfolioId
                    )}
                    {...props}
                  />
                )}
              />
              <Button
                className="m-2 btn-success"
                onClick={this.savePortfolioClicked}
              >
                Save changes to portfolio
              </Button>
              <Button
                className="m-2 btn-danger"
                onClick={this.deletePortfolioClicked}
              >
                Delete this portfolio
              </Button>
            </>
          ) : (
            <h2>select a portfolio...</h2>
          )}
          {/* <Route
            path={`${this.props.match.path}/:portfolioId`}
            component={AllocationTable}
          /> */}
          <Button onClick={this.refreshPortfolios}>Refresh</Button>
          <Button onClick={() => console.log(this.props)}>debug props</Button>
          <Button onClick={() => console.log(this.state)}>debug state</Button>
        </Col>
      </Row>
    );
  }
}

export default PortfolioComponent;

//<ListGroup>
//<ListGroup.Item action variant="dark">
//  <Link to="/portfolios/39">Portfolio 1</Link>
//</ListGroup.Item>
//<ListGroup.Item action variant="dark">
//  Link 2
//</ListGroup.Item>
//<ListGroup.Item variant="dark">
//  <Button>Add new portfolio</Button>
//</ListGroup.Item>
//</ListGroup>

//<AllocationTable
//currentPortfolio={this.getCurrentPortfolio(
//Number(props.match.params.portfolioId)
//)}
//{...props}
