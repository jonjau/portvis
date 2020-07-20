import React, { Component } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";

import PortfolioService from "../service/PortfolioService";
import AssetForm from "./AssetForm";
import PortfolioDetailsForm from "./PortfolioDetailsForm";

class AllocationTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: null,
      name: null,
      initialValue: null,
      assets: [],
    };

    this.addAssetClicked = this.addAssetClicked.bind(this);
    this.deleteAssetClicked = this.deleteAssetClicked.bind(this);
    this.portfolioDetailsSubmitted = this.portfolioDetailsSubmitted.bind(this);
    this.savePortfolioClicked = this.savePortfolioClicked.bind(this);
  }

  componentDidMount() {
    // get the assets of the portfolio with the id portfolioId (a URL param)
    console.log("allocationtable didmount")
    this.getPortfolioAssets(this.props.match.params.portfolioId);
  }

  getPortfolioAssets(portfolioId) {
    PortfolioService.getPortfolioById(portfolioId)
      .then((response) => {
        console.log(`received ${JSON.stringify(response.data, null, 2)}`);
        const portfolio = response.data;
        // map {s1: p1, s2: p2} to [{s1:p1}, {s2, p2}]
        this.setState({
          assets: Object.entries(
            portfolio.allocations
          ).map(([symbol, proportion]) => ({ symbol, proportion })),
        });
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
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

  validatePortfolio(portfolio) {

  }

  savePortfolioClicked() {

  }

  render() {
    // doesn't have to be called submitAction
    return (
      <>
        <Row>
          <Col>
            <PortfolioDetailsForm
              submitAction={this.portfolioDetailsSubmitted}
            />
          </Col>
          <Col>
            <AssetForm
              submitAction={this.addAssetClicked}
              assetSymbols={this.state.assets.map((asset) => asset.symbol)}
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
            {this.state.assets.map((asset) => (
              // symbol must be unique! Validate this with Formik
              // https://reactjs.org/docs/lists-and-keys.html#keys
              <tr className="d-flex" key={asset.symbol}>
                <td className="col-3">{asset.symbol}</td>
                <td className="col-3">{`${asset.proportion * 100}%`}</td>
                <td className="col-3">{`${
                  asset.proportion * this.state.initialValue
                }`}</td>
                <td className="col-3">
                  <Button
                    className="btn-danger"
                    onClick={() => this.deleteAssetClicked(asset.symbol)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        </Row>
        <Row>
        <Button className="m-2 btn-success" onClick={this.savePortfolioClicked}>
          Save changes to portfolio
        </Button>
        <Button className="m-2 btn-danger" onClick={this.savePortfolioClicked}>
          Delete this portfolio
        </Button>
        </Row>
        <Button onClick={() => console.log(this.state)}>debug state</Button>
      </>
    );
  }
}

export default AllocationTable;
