import React, { Component } from "react";
import StockService from "../service/StockService";
import Dygraph from "dygraphs";

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
      <div>
        <h3>lorem</h3>
        <textarea
          defaultValue={JSON.stringify(this.state.stockHistory.timeSeries)}
        ></textarea>
        <div ref="chart" />
        <button onClick={() => this.plotHistory()}>plotHist</button>
      </div>
    );
  }
}

export default StockComponent;
