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
      <Row>
        <Col md={2} className="bg-dark p-2 vh-100">
          <ListGroup variant="flush">
            <ListGroup.Item action href="#link1" variant="dark">
              Link 1
            </ListGroup.Item>
            <ListGroup.Item action href="#link2" variant="dark">
              Link 2
            </ListGroup.Item>
            <ListGroup.Item action href="#link3" variant="dark">
              Link 3
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={10} className="p-4">
          <AllocationTable />
        </Col>
      </Row>
    );
  }
}

export default StockComponent;

// <body className="container-fluid d-flex flex-column">
// <Row>
//   <div className="col-12 bg-primary py-3">Header</div>
//   <div className="col-4 bg-info py-3">Menu</div>
//   <div className="main col-8 bg-warning py-3">
//     <h4>Main</h4>
//     <p className="mb-5">
//       Sriracha biodiesel taxidermy organic post-ironic, Intelligentsia
//       salvia mustache 90's code editing brunch. Butcher polaroid VHS art
//       party, hashtag Brooklyn deep v PBR narwhal sustainable mixtape swag
//       wolf squid tote bag. Tote bag cronut semiotics, raw denim deep v
//       taxidermy messenger bag. Tofu YOLO Etsy, direct trade ethical Odd
//       Future jean shorts paleo. Forage Shoreditch tousled aesthetic irony,
//       street art organic Bushwick artisan cliche semiotics ugh synth
//       chillwave meditation. Shabby chic lomo plaid vinyl chambray Vice.
//       Vice sustainable cardigan, Williamsburg master cleanse hella DIY
//       90's blog.
//     </p>
//   </div>
// </Row>
// </body>
