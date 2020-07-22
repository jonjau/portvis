import React, { Component } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";

//import PortfolioService from "../service/PortfolioService";
import AssetForm from "./AssetForm";
import PortfolioDetailsForm from "./PortfolioDetailsForm";

class AllocationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: "",
      initialValue: 0,
      assets: [],
    };
    //console.log(`table state: ${JSON.stringify(this.state, null, 2)}`)
    //console.log(`table props: ${JSON.stringify(props, null, 2)}`)

    this.addAssetClicked = this.addAssetClicked.bind(this);
    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
    this.portfolioDetailsSubmitted = this.portfolioDetailsSubmitted.bind(this);
  }

  componentDidMount() {
    // get the assets of the portfolio with the id portfolioId (a URL param)
    //console.log("allocationtable didmount");
  }

  componentDidUpdate() {
    //console.log("allocationtable didupdate");
  }

  addAssetClicked(newAsset) {
    // never mutate state directly!
    //alert(JSON.stringify(newAsset, null, 2));
    this.setState((prevState) => ({
      assets: [...prevState.assets, newAsset],
    }));
  }

  deleteAssetClicked(assetSymbol) {
    // assumes assets (their symbols) are unique
    this.setState((prevState) => ({
      assets: prevState.assets.filter((asset) => asset.symbol !== assetSymbol),
    }));
  }

  portfolioDetailsSubmitted(portfolioDetails) {
    this.setState({
      name: portfolioDetails.portfolioName,
      initialValue: portfolioDetails.initialValue,
    });
  }

  validatePortfolio(portfolio) {}

  render() {
    // this.props or props are undefined in contructor(props).
    // In render they aren't. Also, setting state in componentDidUpdate is a
    // bad idea. Google "react you probably don't need derived state".
    //console.log(this.props);

    // doesn't have to be called submitAction
    return (
      <>
        <Row>
          <Col>
            <PortfolioDetailsForm
              currentPortfolio={this.props.currentPortfolio}
              submitAction={this.props.portfolioDetailsSubmitted}
            />
          </Col>
          <Col>
            <AssetForm
              submitAction={this.props.addAssetClicked}
              // turn {s1: p1, s2: p2} to [s1, s2]
              assetSymbols={Object.keys(
                this.props.currentPortfolio.allocations
              )}
            />
          </Col>
        </Row>
        <Row>
          <Table bordered hover className="col-9 table-condensed">
            <thead>
              <tr className="d-flex">
                <th className="col-3">Asset</th>
                <th className="col-3">Proportion</th>
                <th className="col-3">Allocation (USD)</th>
                <th className="col-3"></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(this.props.currentPortfolio.allocations).map(
                ([symbol, proportion]) => (
                  // symbol must be unique! Validate this with Formik
                  // https://reactjs.org/docs/lists-and-keys.html#keys
                  <tr className="d-flex" key={symbol}>
                    <td className="col-3">{symbol}</td>
                    <td className="col-3">{`${proportion * 100}%`}</td>
                    <td className="col-3">{`${(
                      proportion * this.props.currentPortfolio.initialValue
                    ).toFixed(2)}`}</td>
                    <td className="col-3">
                      <Button
                        className="btn-danger"
                        onClick={() => this.props.deleteAssetClicked(symbol)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </Table>
        </Row>

      </>
    );
  }
}

export default AllocationTable;

// getPortfolioAssets(portfolioId) {
//   PortfolioService.getPortfolioById(portfolioId)
//     .then((response) => {
//       console.log(`received ${JSON.stringify(response.data, null, 2)}`);
//       const portfolio = response.data;
//       // map {s1: p1, s2: p2} to [{s1:p1}, {s2, p2}]
//       this.setState({
//         assets: Object.entries(
//           portfolio.allocations
//         ).map(([symbol, proportion]) => ({ symbol, proportion })),
//       });
//     })
//     .catch((error) =>
//       console.log(`error: ${JSON.stringify(error, null, 2)}`)
//     );
// }

// const { currentPortfolio, match } = this.props;
// console.log(JSON.stringify(currentPortfolio, null, 2));

// // mapping {s1: p1, s2: p2} to [{s1:p1}, {s2, p2}]
// const currentPortfolioAssets = Object.entries(
//   currentPortfolio.allocations
// ).map(([symbol, proportion]) => ({ symbol, proportion }));

// this.setState({
//   id: match.url,
//   name: currentPortfolio.name,
//   initialValue: currentPortfolio.initialValue,
//   assets: currentPortfolioAssets,
// });
