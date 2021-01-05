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
import PortfolioEditComponent from "./PortfolioEdit";
import PortfolioService from "../../services/PortfolioService";
import SearchService from "../../services/SearchService";
import { Route } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import _ from "lodash";
import RefreshIcon from "../icons/RefreshIcon";
import LeftArrow from "../icons/LeftArrow";

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

    this.setState({
      name: portfolioDetails.portfolioName,
      initialValue: portfolioDetails.initialValue,
    });
  }

  async savePortfolioClicked() {
    const currId = this.state.currentPortfolioId;
    console.log(this.state.portfolios);

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
      initialValue: 1000,
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

  // this should work, how does one render things based on async state updates?
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
                <Alert variant="info" className="m-2">
                  Ensure assets in portfolio exist and are supported by
                  searching them in the search bar.
                </Alert>
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
