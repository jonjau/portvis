import React, { Component } from "react";
import PortfolioService from "../service/PortfolioService";

class Test extends React.Component {
  constructor(props) {
    super(props);

    const a = 3;
    console.log("test did construct");
    console.log(this.props);
  }

  componentDidMount() {
    console.log("test did mount");
    const { match, currentPortfolio } = this.props;

    console.log(`${JSON.stringify(currentPortfolio, null, 2)} stringss`);
  }

  componentDidUpdate() {
    const { match, currentPortfolio } = this.props;
    console.log(`${match.params.portfolioId} haloco`);
    console.log(`${JSON.stringify(currentPortfolio, null, 2)} stringss`);
    //this.getPortfolioAssets(match.params.portfolioId);
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

  render() {
    const { match } = this.props;
    return <h3>hello {`${match.params.portfolioId}`}</h3>;
  }
}

export default Test;
