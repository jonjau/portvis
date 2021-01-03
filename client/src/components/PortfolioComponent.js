import React, { Component } from "react";
import {
  ListGroup,
  Row,
  Col,
  Button,
  Nav,
  ButtonGroup,
  Alert,
} from "react-bootstrap";
import PortfolioEditComponent from "./PortfolioEditComponent";
import PortfolioService from "../service/PortfolioService";
import SearchService from "../service/SearchService";
import { Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
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
      className="bi bi-arrow-repeat"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M2.854 7.146a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L2.5
        8.207l1.646 1.647a.5.5 0 0 0 .708-.708l-2-2zm13-1a.5.5 0 0 0-.708
        0L13.5 7.793l-1.646-1.647a.5.5 0 0 0-.708.708l2 2a.5.5 0 0 0 .708
        0l2-2a.5.5 0 0 0 0-.708z"
      />
      <path
        fillRule="evenodd"
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
      className="bi bi-arrow-left-short"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M7.854 4.646a.5.5 0 0 1 0 .708L5.207 8l2.647 2.646a.5.5 0 0
        1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0z"
      />
      <path
        fillRule="evenodd"
        d="M4.5 8a.5.5 0 0 1 .5-.5h6.5a.5.5 0 0 1 0 1H5a.5.5 0 0 1-.5-.5z"
      />
    </svg>
  );
}

class PortfolioComponent extends Component {
  // FIXME: check if stocks exist! a better check than the current crude one
  constructor(props) {
    super(props);

    this.state = {
      portfolios: new Map(),
      currentPortfolioId: this.props.match.params.portfolioId,
    };
    this.refreshPortfolios = this.refreshPortfolios.bind(this);
    this.getCurrentPortfolio = this.getCurrentPortfolio.bind(this);

    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
    this.addAssetClicked = this.addAssetClicked.bind(this);
    this.portfolioDetailsSubmitted = this.portfolioDetailsSubmitted.bind(this);

    this.savePortfolioClicked = this.savePortfolioClicked.bind(this);
    this.deletePortfolioClicked = this.deletePortfolioClicked.bind(this);
    this.addPortfolioClicked = this.addPortfolioClicked.bind(this);
    this.deleteAllPortfoliosClicked = this.deleteAllPortfoliosClicked.bind(
      this
    );

    this.isPortfolioFullyAllocated = this.isPortfolioFullyAllocated.bind(this);
    this.doesPortfolioContainOnlyExistentAssets = this.doesPortfolioContainOnlyExistentAssets.bind(
      this
    );
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

  async savePortfolioClicked() {
    const currId = this.state.currentPortfolioId;
    console.log(this.state.portfolios);

    const valid = await this.doesPortfolioContainOnlyExistentAssets();

    if (!valid) {
      alert(
        `Portfolio contains assets that do not exist or are not supported.
        Details were not saved`);
      return;
    }

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
    const newPortfolio = {
      username: this.props.username,
      name: "",
      initialValue: 100,
      allocations: { MSFT: 1.0 },
    };
    console.log(this.props.username);
    console.log(`${this.props.match.path}`);
    PortfolioService.addPortfolio(newPortfolio)
      .then((response) => {
        // what is this condition for??
        if (_.has(response.data, "id")) {
          // the following lines are likely wrong...
          const currId = newPortfolio.id;
          console.log(this.state);
          this.setState({ currentPortfolioId: currId });
          this.props.history.push(`/portfolios/${currId}`);
        } else {
          // necessary?
          alert("Portfolio was not successfully added.");
        }
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to add a new portfolio.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  deleteAllPortfoliosClicked() {
    PortfolioService.deleteAllPortfolios()
      .then((response) => {
        if (response.data.deleted === true) {
          this.setState({ currentPortfolioId: null });
          this.props.history.push(`/portfolios/`);
        } else {
          alert("Portfolios were not successfully deleted.");
        }
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to delete all portfolios.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  isPortfolioFullyAllocated() {
    const { portfolios, currentPortfolioId: currId } = this.state;
    return _.sum(Object.values(portfolios.get(currId).allocations)) === 1.0;
  }

  async doesPortfolioContainOnlyExistentAssets() {
    const { portfolios, currentPortfolioId } = this.state;
    const companyNames = Object.keys(
      portfolios.get(currentPortfolioId).allocations
    );
    const exists = await Promise.all(
      companyNames.map(
        async (companyName) =>
          await SearchService.getCompany(companyName)
            .then(() => true)
            .catch(() => false)
      )
    );
    return exists.every((c) => c === true);
  }

  render() {
    const { portfolios, currentPortfolioId } = this.state;
    return (
      <Row>
        <Col md="2" className="bg-secondary p-2 min-vh-100">
          <Nav as={ListGroup} className="flex-column">
            <ListGroup.Item disable="true" variant="secondary">
              <ButtonGroup>
                <Button className="btn-info" onClick={this.addPortfolioClicked}>
                  Add new portfolio
                </Button>
                <Button variant="warning" onClick={this.refreshPortfolios}>
                  <RefreshIcon />
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
            {Array.from(portfolios.values()).map((portfolio) => (
              <LinkContainer
                to={`/portfolios/${portfolio.id}/`}
                key={portfolio.id}
              >
                <Nav.Link
                  as={ListGroup.Item}
                  variant="dark"
                  action
                  onClick={() =>
                    // this.props.history.push(...) seems to work too
                    this.setState({ currentPortfolioId: portfolio.id })
                  }
                >
                  {/* truncate portfolio name so display looks sensible */}
                  {_.truncate(portfolio.name, { length: 18 })} ({portfolio.id})
                </Nav.Link>
              </LinkContainer>
            ))}
            <ListGroup.Item disable="true" variant="secondary">
              <Button
                variant="danger"
                onClick={this.deleteAllPortfoliosClicked}
              >
                Delete all portfolios
              </Button>
            </ListGroup.Item>
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          {currentPortfolioId ? (
            <>
              <Route
                // can access with this.props.match.params.portfolioId
                path={`${this.props.match.path}:portfolioId/`}
                render={(props) => (
                  // instead of using higher order components, we can do
                  // {...props}
                  // to pass some (not all!) props to a Component
                  <PortfolioEditComponent
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
              <Row>
                <Button
                  className="m-2 btn-success"
                  onClick={this.savePortfolioClicked}
                  disabled={
                    !this.isPortfolioFullyAllocated() ||
                    !this.doesPortfolioContainOnlyExistentAssets
                  }
                >
                  Save changes to portfolio
                </Button>
                <Button
                  className="m-2 btn-danger"
                  onClick={this.deletePortfolioClicked}
                >
                  Delete this portfolio
                </Button>
                {this.isPortfolioFullyAllocated() ? null : (
                  <Alert variant="warning" className="m-2">
                    Total portfolio allocation must be exactly 100%. Adjust
                    assets to reach 100% total allocation before saving changes.
                  </Alert>
                )}
                {this.doesPortfolioContainOnlyExistentAssets() ? null : (
                  <Alert variant="warning" className="m-2">
                    Portfolio contains assets that do not exist or are not
                    supported.
                  </Alert>
                )}
              </Row>
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
