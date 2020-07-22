import React, { Component } from "react";
import { ListGroup, Row, Col, Button, Nav, ButtonGroup } from "react-bootstrap";
import AllocationTable from "./AllocationTable";
import PortfolioService from "../service/PortfolioService";
import { Route } from "react-router-dom";
import _ from "lodash";

/**
 * Component wrapper that returns a refresh icon from Bootstrap's icon set.
 */
function RefreshIcon() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      class="bi bi-arrow-repeat"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5
        8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708
        0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708
        0l2-2a.5.5 0 0 0 0-.708z"
      />
      <path
        fill-rule="evenodd"
        d="M8 3a4.995 4.995 0 0 0-4.192 2.273.5.5 0 0 1-.837-.546A6 6 0 0 1
        14 8a.5.5 0 0 1-1.001 0 5 5 0 0 0-5-5zM2.5 7.5A.5.5 0 0 1 3 8a5 5 0 0
        0 9.192 2.727.5.5 0 1 1 .837.546A6 6 0 0 1 2 8a.5.5 0 0 1 .501-.5z"
      />
    </svg>
  );
}

/**
 * Component wrapper that returns a left arrow icon from Bootstrap's icon set.
 */
function LeftArrow() {
  return (
    <svg
      width="2em"
      height="2em"
      viewBox="0 0 16 16"
      class="bi bi-arrow-left-short"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        d="M7.854 4.646a.5.5 0 0 1 0 .708L5.207 8l2.647 2.646a.5.5 0 0
        1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
      />
      <path
        fill-rule="evenodd"
        d="M4.5 8a.5.5 0 0 1 .5-.5h6.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

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
    const newPortfolio = { name: "", initialValue: 0, allocations: {} };
    PortfolioService.addPortfolio(newPortfolio)
      .then((response) => {
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
    return (
      <Row>
        <Col md={2} className="bg-secondary p-2 vh-100">
          <Nav as={ListGroup} className="flex-column">
            <ListGroup.Item disable="true" variant="secondary">
              <ButtonGroup>
                <Button className="btn-info" onClick={this.addPortfolioClicked}>
                  Add new portfolio
                </Button>
                <Button
                  className="btn-warning"
                  onClick={this.refreshPortfolios}
                >
                  <RefreshIcon />
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
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
            <h2>
              <LeftArrow />
              Select a portfolio
            </h2>
          )}
        </Col>
      </Row>
    );
  }
}

export default PortfolioComponent;
