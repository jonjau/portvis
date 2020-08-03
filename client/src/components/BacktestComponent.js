import React, { Component } from "react";
import StockService from "../service/StockService";
import {
  Row,
  Col,
  Table,
  Button,
  ListGroup,
  ButtonGroup,
} from "react-bootstrap";
import PortfolioService from "../service/PortfolioService";
import BacktestService from "../service/BacktestService";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Chart from "chart.js";
import moment from "moment";
//import "chartjs-adapter-moment";

// Returns an array of dates between the two dates
function getDatesBetween(startDate, endDate) {
  const dates = [];

  // Strip hours minutes seconds etc.
  let currentDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate()
  );

  while (currentDate <= endDate) {
    dates.push(currentDate);

    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1 // Will increase month if over range
    );
  }

  return dates;
}

function getISODateOnly(date) {
  console.log(date.getMonth());
  // month is 0-11 while date is 1-31...
  return `${date.getFullYear().toString().padStart(4, "0")}` +
         `-${(date.getMonth()+1).toString().padStart(2, "0")}` +
         `-${date.getDate().toString().padStart(2, "0")}`;
}

function newDate(days) {
  return moment().add(days, "d").toDate();
}

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
      startDate: new Date(),
      endDate: new Date(),
      chartData: [],
    };

    this.refreshStock = this.refreshStock.bind(this);
    this.plotHistory = this.plotHistory.bind(this);

    this.refreshPortfolios = this.refreshPortfolios.bind(this);

    this.selectPortfolio = this.selectPortfolio.bind(this);
    this.deselectPortfolio = this.deselectPortfolio.bind(this);

    this.backtestPortfolios = this.backtestPortfolios.bind(this);
    this.plotChart = this.plotChart.bind(this);
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
    // new Dygraph(
    //   // this is legacy apparently
    //   this.refs.chart,
    //   dataArray,
    //   {}
    // );
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
    const startDate = getISODateOnly(this.state.startDate);
    const endDate = getISODateOnly(this.state.endDate);
    //const dates = getDatesBetween(new Date(2020, 7, 12), new Date(2020, 7, 15));
    //console.log(dates);
    BacktestService.getReturns(portfolioIds, startDate, endDate)
      .then((response) => {
        //TODO: delete this log
        this.setState({ chartData: response.data });
        console.log(response.data);
        this.plotChart();
      })
      .catch((error) => {
        alert("An error occurred when trying to backtest the portfolios.");
        console.log(`error: ${JSON.stringify(error, null, 2)}`);
        throw error;
      });
  }

  plotChart() {
    const dates = Object.keys(this.state.chartData)
      .map((dateString) => new Date(dateString))
      .sort((date1, date2) => date1 - date2);
    // console.log(dates);
    // const prices = Object.values(data).map((price) => price[0]);

    const priceData = this.state.selectedPortfolioIds.map((id, i) => {
      const obj = {
        portfolio: [this.state.portfolios.get(id)],
        returns: Object.entries(this.state.chartData).map(
          ([_, prices]) => prices[i]
        ),
      };
      //console.log(obj);
      return obj;
    });

    //    const priceData = Object.entries(
    //      this.state.chartData
    //    ).map(([date, prices]) => );
    console.log(priceData);
    const data = {
      // Labels should be Date objects
      labels: dates,
      datasets: [
        {
          fill: false,
          label: "aaa",
          data: priceData[0].returns,
          borderColor: "teal",
          backgroundColor: "teal",
          lineTension: 0,
        },
      ],
    };
    const options = {
      type: "line",
      data: data,
      options: {
        fill: false,
        responsive: true,
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
    new Chart("backtestChart", options);
  }

  render() {
    return (
      <Row>
        <Col md="3" className="bg-secondary p-2 vh-100">
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
                    selected={this.state.startDate}
                    onChange={(date) => this.setState({ startDate: date })}
                    //minDate={
                    maxDate={this.state.endDate}
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
                    selected={this.state.endDate}
                    onChange={(date) => this.setState({ endDate: date })}
                    minDate={this.state.startDate}
                    maxDate={new Date()}
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
                  <td className="col-8">{`${portfolio.name} (${portfolio.id})`}</td>
                  <td className="col-4">
                    {this.state.selectedPortfolioIds.includes(portfolio.id) ? (
                      <Button
                        className="btn-danger p-1"
                        onClick={() => this.deselectPortfolio(portfolio.id)}
                      >
                        Deselect
                      </Button>
                    ) : (
                      <Button
                        className="btn-success p-1"
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
            <Col md="6">
              <canvas id="backtestChart" width="400" height="400"></canvas>
              <Button onClick={() => console.log(this.state)}>
                debug state
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default BacktestComponent;
