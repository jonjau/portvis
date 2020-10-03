import React, { Component } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  ListGroup,
  ButtonGroup,
  Card,
} from "react-bootstrap";
import PortfolioService from "../service/PortfolioService";
import BacktestService from "../service/BacktestService";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Chart from "chart.js";
import moment from "moment";
//import "chartjs-adapter-moment";
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

class BacktestComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockHistory: [],
      portfolios: new Map(),
      selectedPortfolioIds: [],
      startDate: moment().subtract(24, "days"),
      endDate: moment().subtract(3, "days"),
      chartData: [],
    };
    this.chartRef = React.createRef();
    // FIXME: improve tooltip readability
    this.chartColors = [
      "SteelBlue",
      "Orange",
      "Teal",
      "FireBrick",
      "Olive",
      "Sienna",
      "Purple",
      "Gold",
    ];

    this.refreshPortfolios = this.refreshPortfolios.bind(this);

    this.selectPortfolio = this.selectPortfolio.bind(this);
    this.deselectPortfolio = this.deselectPortfolio.bind(this);

    this.backtestPortfolios = this.backtestPortfolios.bind(this);
    this.plotChart = this.plotChart.bind(this);
    this.initChart = this.initChart.bind(this);
  }

  componentDidMount() {
    this.refreshPortfolios();
    this.initChart();
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

  selectPortfolio(id) {
    this.setState((prevState) => ({
      selectedPortfolioIds: [...prevState.selectedPortfolioIds, id],
    }));
  }

  deselectPortfolio(id) {
    this.setState((prevState) => ({
      selectedPortfolioIds: prevState.selectedPortfolioIds.filter(
        (currId) => currId !== id
      ),
    }));
  }

  backtestPortfolios() {
    const portfolioIds = this.state.selectedPortfolioIds;
    const startDate = this.state.startDate.format("YYYY-MM-DD");
    const endDate = this.state.endDate.format("YYYY-MM-DD");
    //const dates = getDatesBetween(new Date(2020, 7, 12), new Date(2020, 7, 15));
    //console.log(dates);
    BacktestService.getReturns(portfolioIds, startDate, endDate)
      .then((response) => {
        this.setState({ chartData: response.data });
        this.plotChart();
      })
      .catch((error) => {
        alert("An error occurred when trying to backtest the portfolios.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        throw error;
      });
  }

  plotChart() {
    const dates = Object.keys(this.state.chartData).map(
      (dateString) => new Date(dateString)
    );
    //.sort((date1, date2) => date1 - date2);

    // price data for each portfolio
    const priceData = this.state.selectedPortfolioIds.map((id, i) => {
      const priceDataForOnePortfolio = {
        portfolio: this.state.portfolios.get(id),
        returns: Object.values(this.state.chartData).map((prices) => prices[i]),
      };
      return priceDataForOnePortfolio;
    });

    //console.log(priceData);

    const datasets = this.state.selectedPortfolioIds.map((_, i) => {
      const dataset = {
        fill: false,
        lineTension: 0,
        label: `${priceData[i].portfolio.name}(${priceData[i].portfolio.id})`,
        data: priceData[i].returns,
        backgroundColor: this.chartColors[i % this.chartColors.length],
        borderColor: this.chartColors[i % this.chartColors.length],
      };
      return dataset;
    });

    const startDate = this.state.startDate.format("YYYY-MM-DD");
    const endDate = this.state.endDate.format("YYYY-MM-DD");

    this.chart.options.title.text = `${startDate} to ${endDate}`;
    this.chart.data.labels = dates;
    this.chart.data.datasets = [...datasets];
    this.chart.update();
  }

  initChart() {
    const options = {
      type: "line",
      data: {},
      options: {
        fill: false,
        responsive: true,
        title: {
          display: true,
          text: "Select portfolios to backtest!",
        },
        tooltips: {
          position: "nearest",
          mode: "index",
          intersect: false,
        },
        scales: {
          xAxes: [
            {
              type: "time",
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Date",
              },
              time: {
                unit: "day",
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                //beginAtZero: true,
              },
              display: true,
              scaleLabel: {
                display: true,
                labelString: "Price (USD)",
              },
            },
          ],
        },
      },
    };
    // string or context (ref)?
    this.chart = new Chart("backtestChart", options);
  }

  render() {
    //FIXME: select/deselect all button
    return (
      <Row>
        <Col md="3" className="bg-secondary p-2 min-vh-100">
          <ListGroup>
            <ListGroup.Item align="center" disable="true" variant="secondary">
              <Row>
                <Col>
                  <ButtonGroup className="p-2">
                    <Button
                      className="btn-info"
                      onClick={this.backtestPortfolios}
                    >
                      Backtest selected portfolios
                    </Button>
                    <Button
                      className="btn-warning"
                      onClick={this.refreshPortfolios}
                    >
                      <RefreshIcon />
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
              <Row>
                <Col md="5">
                  <DatePicker
                    className="col-12"
                    closeOnScroll={true}
                    selected={this.state.startDate.toDate()}
                    onChange={(date) =>
                      this.setState({ startDate: moment(date) })
                    }
                    //minDate={
                    maxDate={this.state.endDate.toDate()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    name="startDate"
                    dateFormat="yyyy-MM-dd"
                  />
                </Col>
                <Col md="2">to</Col>
                <Col md="5">
                  <DatePicker
                    className="col-12"
                    closeOnScroll={true}
                    selected={this.state.endDate.toDate()}
                    onChange={(date) =>
                      this.setState({ endDate: moment(date) })
                    }
                    minDate={this.state.startDate.toDate()}
                    maxDate={moment().subtract(2, "days").toDate()}
                    peekNextMonth
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    name="endDate"
                    dateFormat="yyyy-MM-dd"
                  />
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
          <Table bordered hover variant="dark" className="table-condensed">
            <thead>
              <tr className="d-flex">
                <th className="col-8">Portfolio Name (ID)</th>
                <th className="col-4"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(this.state.portfolios.values()).map((portfolio) => (
                <tr className="d-flex" key={portfolio.id}>
                  <td className="col-8">
                    {`${_.truncate(portfolio.name, {length: 18,})}
                    (${portfolio.id})`}
                  </td>
                  <td className="col-4">
                    {this.state.selectedPortfolioIds.includes(portfolio.id) ? (
                      <Button
                        variant="outline-danger"
                        className="p-1"
                        onClick={() => this.deselectPortfolio(portfolio.id)}
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        variant="outline-success"
                        className="p-1"
                        onClick={() => this.selectPortfolio(portfolio.id)}
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
        <Col md="9">
          <Row>
            <div className="w-100">
              <canvas id="backtestChart" ref={this.chartRef}></canvas>
            </div>
          </Row>
          <Row>
            <Card className="m-4">
              <Card.Header>
                <h4>Assumptions and remarks</h4>
              </Card.Header>
              <Card.Body>
                <ul>
                  <li>
                    The price metric used for each period is the OHLC average.
                  </li>
                  <li>
                    Returns from assets are compounded daily.
                  </li>
                  <li>Portfolios are rebalanced daily.</li>
                  <li>No fees associated with rebalancing.</li>
                  <li>
                    Figures are approximate (significant deviation for larger
                    date ranges).
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default BacktestComponent;
