import React, { Component } from "react";
import {
  Row,
  Col,
  Table,
  Button,
  ListGroup,
  ButtonGroup,
  Spinner,
} from "react-bootstrap";
import PortfolioService from "../../services/PortfolioService";
import BacktestService from "../../services/BacktestService";

import RefreshIcon from "../icons/RefreshIcon";
import RemarksCard from "./RemarksCard";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Chart from "chart.js";
import moment from "moment";
//import "chartjs-adapter-moment";
import _ from "lodash";

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
      loading: false,
    };
    this.chartRef = React.createRef();
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
    this.setState({loading: true}, () => {
      BacktestService.getReturns(portfolioIds, startDate, endDate)
        .then((response) => {
          this.setState({ chartData: response.data, loading: false });
          this.plotChart();
        })
        .catch((error) => {
          this.setState({ loading: false });
          alert("An error occurred when trying to backtest the portfolios.");
          console.log(`error: ${JSON.stringify(error, null, 2)}`);
        });
    })
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
    return (
      <Row>
        <Col md="3" className="bg-secondary p-2 min-vh-100">
          <ListGroup>
            <ListGroup.Item align="center" disable="true" variant="secondary">
              <Row>
                <Col className="d-flex justify-content-center">
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
                  {this.state.loading ? <Spinner animation="border" /> : null}
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
                <td className="col-12 text-center">
                  <ButtonGroup>
                    <Button
                      variant="outline-success"
                      onClick={() =>
                        Array.from(this.state.portfolios.keys()).forEach((id) =>
                          this.selectPortfolio(id)
                        )
                      }
                    >
                      Select all
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() =>
                        Array.from(this.state.portfolios.keys()).forEach((id) =>
                          this.deselectPortfolio(id)
                        )
                      }
                    >
                      Deselect all
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
              <tr className="d-flex">
                <th className="col-8">Portfolio Name (ID)</th>
                <th className="col-4"></th>
              </tr>
            </thead>
            <tbody>
              {Array.from(this.state.portfolios.values()).map((portfolio) => (
                <tr className="d-flex" key={portfolio.id}>
                  <td className="col-8">
                    {`${_.truncate(portfolio.name, { length: 18 })}
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
            <RemarksCard />
          </Row>
        </Col>
      </Row>
    );
  }
}

export default BacktestComponent;
