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
import PortfolioEdit from "./PortfolioEdit";
import PortfolioService from "../../services/PortfolioService";
import SearchService from "../../services/SearchService";
import { Route, RouteComponentProps } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import _ from "lodash";
import RefreshIcon from "../icons/RefreshIcon";
import LeftArrow from "../icons/LeftArrow";
import {
  Allocation,
  Portfolio,
  PortfolioDetails,
} from "../../models/Portfolio";

interface MatchParams {
  portfolioId: string;
}

interface Props extends RouteComponentProps<MatchParams> {
  username: string;
}

interface State {
  portfolios: {
    [id: string]: Portfolio;
  };
  currentPortfolioId: string;
}

class PortfolioComponent extends Component<Props, State> {
  // FIXME: check if stocks exist! a better check than the current crude one
  constructor(props: Props) {
    super(props);

    this.state = {
      // map portfolio ids to the portfolios
      portfolios: {},
      currentPortfolioId: this.props.match.params.portfolioId,
    };
    this.refreshPortfolios = this.refreshPortfolios.bind(this);
    this.getCurrentPortfolio = this.getCurrentPortfolio.bind(this);

    this.deleteAsset = this.deleteAsset.bind(this);
    this.addAsset = this.addAsset.bind(this);
    this.submitPortfolioDetails = this.submitPortfolioDetails.bind(this);

    this.savePortfolio = this.savePortfolio.bind(this);
    this.deletePortfolio = this.deletePortfolio.bind(this);
    this.addPortfolio = this.addPortfolio.bind(this);
    this.deleteAllPortfolios = this.deleteAllPortfolios.bind(this);

    this.isFullyAllocated = this.isFullyAllocated.bind(this);
    this.containsOnlyExistentAssets = this.containsOnlyExistentAssets.bind(
      this
    );
  }

  componentDidMount() {
    this.refreshPortfolios();
  }

  componentDidUpdate() {}

  getCurrentPortfolio(portfolioId: string): Portfolio {
    // assumes portfolioId is a NUMBER and portfolioId's are unique
    const currentPortfolio = Object.values(this.state.portfolios).filter(
      (portfolio) => portfolio.id === portfolioId
    )[0];
    return currentPortfolio;
  }

  refreshPortfolios() {
    PortfolioService.getAllPortfolios()
      .then((response) => {
        //console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
        // make a map so lookup by id is easier
        this.setState({
          portfolios: Object.fromEntries(response.data.map((p) => [p.id, p])),
        });
      })
      .catch((error) => {
        alert("Failed to refresh portfolios.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  addAsset(newAsset: Allocation): void {
    // never mutate state directly!
    const { symbol, proportion } = newAsset;
    const currId = this.state.currentPortfolioId;
    const newPortfolios = { ...this.state.portfolios };

    newPortfolios[currId].allocations[symbol] = proportion;

    this.setState({ portfolios: newPortfolios });
  }

  deleteAsset(assetSymbol: string): void {
    // assumes assets (their symbols) are unique
    const currId = this.state.currentPortfolioId;
    const newPortfolios = { ...this.state.portfolios };
    delete newPortfolios[currId].allocations[assetSymbol];

    this.setState({ portfolios: newPortfolios });
  }

  submitPortfolioDetails(portfolioDetails: Portfolio): void {
    const { name, initialValue } = portfolioDetails;
    const currId = this.state.currentPortfolioId;
    const newPortfolios = { ...this.state.portfolios };

    newPortfolios[currId].name = name;
    newPortfolios[currId].initialValue = initialValue;
  }

  savePortfolio(): void {
    const currId = this.state.currentPortfolioId;

    PortfolioService.updatePortfolio(
      Number(currId),
      this.state.portfolios[currId]
    )
      .then((response) => {
        if (!_.isEqual(response.data, this.state.portfolios[currId])) {
          // console.log(response.data);
          // console.log(this.state.portfolios[currId]);
          alert("Portfolio was not succesfully updated.");
        }
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to save this portfolio.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  deletePortfolio(): void {
    const currId = this.state.currentPortfolioId;
    PortfolioService.deletePortfolio(Number(currId))
      .then((response) => {
        if (response.data.deleted === true) {
          this.setState({ currentPortfolioId: "" });
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

  addPortfolio() {
    const newPortfolio: PortfolioDetails = {
      username: this.props.username,
      name: "",
      initialValue: 1000,
      allocations: { MSFT: 1.0 },
    };
    PortfolioService.addPortfolio(newPortfolio)
      .then((response) => {
        const addedPortfolio = response.data;
        const currId = addedPortfolio.id;
        this.setState((prevState) => ({
          portfolios: { ...prevState.portfolios, [currId]: addedPortfolio },
          currentPortfolioId: currId,
        }));
        this.props.history.push(`/portfolios/${currId}`);
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to add a new portfolio.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  deleteAllPortfolios(): void {
    PortfolioService.deleteAllPortfolios()
      .then((response) => {
        this.setState({ currentPortfolioId: ""});
        this.props.history.push(`/portfolios/`);
        this.refreshPortfolios();
      })
      .catch((error) => {
        alert("An error occurred when trying to delete all portfolios.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
      });
  }

  isFullyAllocated() {
    const { portfolios, currentPortfolioId: currId } = this.state;
    return _.sum(Object.values(portfolios[currId].allocations)) === 1.0;
  }

  // this should work but it doesn't,
  // how do you render things based on async state updates?
  async containsOnlyExistentAssets() {
    const { portfolios, currentPortfolioId } = this.state;
    const companyNames = Object.keys(
      portfolios[currentPortfolioId].allocations
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
            <ListGroup.Item variant="secondary">
              <ButtonGroup>
                <Button className="btn-info" onClick={this.addPortfolio}>
                  Add new portfolio
                </Button>
                <Button variant="warning" onClick={this.refreshPortfolios}>
                  <RefreshIcon />
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
            {Object.values(portfolios).map((portfolio) => (
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
            <ListGroup.Item variant="secondary">
              <Button variant="danger" onClick={this.deleteAllPortfolios}>
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
                  <PortfolioEdit
                    portfolioDetailsSubmitted={this.submitPortfolioDetails}
                    deleteAssetClicked={this.deleteAsset}
                    addAssetClicked={this.addAsset}
                    currentPortfolio={
                      this.state.portfolios[this.state.currentPortfolioId]
                    }
                    {...props}
                  />
                )}
              />
              <Row>
                <Button
                  className="m-2 btn-success"
                  onClick={this.savePortfolio}
                  disabled={
                    !this.isFullyAllocated() || !this.containsOnlyExistentAssets
                  }
                >
                  Save changes to portfolio
                </Button>
                <Button
                  className="m-2 btn-danger"
                  onClick={this.deletePortfolio}
                >
                  Delete this portfolio
                </Button>
                {this.isFullyAllocated() ? null : (
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
