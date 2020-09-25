import React, { Component } from "react";
//import StockService from "../service/StockService";

import { Row, Col, Table, Container, Button } from "react-bootstrap";
import { Route } from "react-router-dom";

class StockComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.match.path);
  }

  render() {
    const stock = this.props.searchedStock;

    return (
      <Row className="bg-secondary min-vh-100">
        <Container className="bg-light min-vh-100">
          {stock ? <div>{stock.description}</div> : <div>aaaa</div>}
          <Button onClick={()=>console.log(stock)}>asdsad</Button>
        </Container>
      </Row>
    );
  }
}

export default StockComponent;

// refreshStock() {
//   StockService.getStockHistory("lorem ipsum")
//     .then((response) => {
//       //console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
//       this.setState({ stockHistory: response.data });
//     })
//     .catch((error) =>
//       console.log(`error: ${JSON.stringify(error, null, 2)}`)
//     );
// }
