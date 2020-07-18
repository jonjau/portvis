import React, { Component } from "react";
import StockService from "../service/StockService";
import Dygraph from "dygraphs";
import { ListGroup, Row, Col, Container } from "react-bootstrap";
import "./BacktestComponent.css";
import AllocationTable from "./AllocationTable";

class StockComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stockHistory: [],
    };

    this.refreshStock = this.refreshStock.bind(this);
    this.plotHistory = this.plotHistory.bind(this);
  }

  componentDidMount() {
    //this.refreshStock();
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

  getOHLCAverage(prices) {
    const keys = ["open", "high", "low", "close"];
    let sum = 0;
    for (let key of keys) {
      sum += prices[key];
    }
    return sum / keys.length;
  }

  render() {
    return (
      <Container fluid="true" className="d-flex flex-column">
        <Row>
          <Col md={2} className="bg-success p-0">
            <ListGroup variant="flush">
              <ListGroup.Item action href="#link1" variant="info">
                Link 1
              </ListGroup.Item>
              <ListGroup.Item action href="#link2" variant="info">
                Link 2
              </ListGroup.Item>
              <ListGroup.Item action href="#link3" variant="info">
                Link 3
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={10} className="bg-light">
            <textarea
              defaultValue={JSON.stringify(this.state.stockHistory.timeSeries)}
            ></textarea>
            <div ref="chart" />
            <button onClick={() => this.plotHistory()}>plotHist</button>
            <AllocationTable />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default StockComponent;
