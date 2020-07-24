import React, { Component } from "react";
import StockService from "../service/StockService";
import Dygraph from "dygraphs";
import { Row, Col, Table, Button, ListGroup, ButtonGroup } from "react-bootstrap";
import PortfolioService from "../service/PortfolioService";

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

class BacktestComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockHistory: [],
      portfolios: new Map(),
      selectedPortfolioIds: [],
    };

    this.refreshStock = this.refreshStock.bind(this);
    this.plotHistory = this.plotHistory.bind(this);

    this.refreshPortfolios = this.refreshPortfolios.bind(this);

    this.selectPortfolio = this.selectPortfolio.bind(this);
    this.deselectPortfolio = this.deselectPortfolio.bind(this);

    this.backtestPortfolios = this.backtestPortfolios.bind(this);
  }

  componentDidMount() {
    //this.refreshStock();
    this.refreshPortfolios();
  }

  refreshPortfolios() {
    PortfolioService.getAllPortfolios()
      .then((response) => {
        //console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
        // make a map so lookup by id is easier
        this.setState({
          portfolios: new Map(
            response.data.map((portfolio) => [portfolio.id, portfolio])
          ),
        });
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
  }

  refreshStock() {
    StockService.getStockHistory("lorem ipsum")
      .then((response) => {
        //console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
        this.setState({ stockHistory: response.data });
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
  }

  plotHistory() {
    const timeSeriesData = this.state.stockHistory.timeSeries;

    const dataArray = Object.keys(timeSeriesData).map((dateTime) => [
      new Date(dateTime),
      this.getOHLCAverage(timeSeriesData[dateTime]),
    ]);
    //console.log(dataArray);
    new Dygraph(
      // this is legacy apparently
      this.refs.chart,
      dataArray,
      {}
    );
  }

  selectPortfolio(id) {
    this.setState((prevState) => ({
      selectedPortfolioIds: [...prevState.selectedPortfolioIds, id],
    }));
  }

  deselectPortfolio(id) {
    this.setState((prevState) => ({
      selectedPortfolioIds: prevState.selectedPortfolioIds.filter(
        currId => currId !== id
      ),
    }));
  }

  backtestPortfolios() {

  }

  render() {
    return (
      <Row>
        <Col md="4" className="bg-secondary p-2 vh-100">
          <ListGroup className="">
            <ListGroup.Item disable="true" variant="secondary">
            <ButtonGroup>
                <Button className="btn-info" onClick={this.backtestPortfolios}>
                  Backtest selected portfolios
                </Button>
                <Button
                  className="btn-warning"
                  onClick={this.refreshPortfolios}
                >
                  <RefreshIcon />
                </Button>
              </ButtonGroup>
            </ListGroup.Item>
          </ListGroup>
          <Table bordered hover variant="dark" className="table-condensed">
            <thead>
              <tr className="d-flex">
                <th className="col-5">Portfolio Name (ID)</th>
                <th className="col-4">Initial Value (USD)</th>
                <th className="col-3"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(this.state.portfolios.values()).map((portfolio) => (
                <tr className="d-flex" key={portfolio.id}>
                  <td className="col-5">{`${portfolio.name} (${portfolio.id})`}</td>
                  <td className="col-4">{portfolio.initialValue}</td>
                  <td className="col-3">
                    {this.state.selectedPortfolioIds.includes(portfolio.id) ? (
                      <Button
                        className="btn-danger p-1"
                        onClick={() =>
                          this.deselectPortfolio(portfolio.id)
                        }
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        className="btn-info p-1"
                        onClick={() =>
                          this.selectPortfolio(portfolio.id)
                        }
                      >
                        Select
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
        <Col md="8">
          <Button onClick={() => console.log(this.state)}>debug state</Button>
        </Col>
      </Row>
    );
  }
}

export default BacktestComponent;

