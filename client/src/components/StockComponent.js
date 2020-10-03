import React, { Component } from "react";
//import StockService from "../service/StockService";

import { Row, Container, Button, Badge } from "react-bootstrap";
//import { Route } from "react-router-dom";

class StockComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.match.path);
  }

  render() {
    //const stock = this.props.searchedStock;
    const stock = this.props.searchedStock;
    console.log(stock);

    return (
      <Row className="bg-secondary min-vh-100">
        <Container className="bg-light min-vh-100">
          {stock ? (
            <Container className="m-2">
              <h1>
                <Badge variant="dark">{stock.Symbol}</Badge>
                &nbsp; {stock.Name}
              </h1>
              <h3 className="text-muted">
                {stock.Sector} | {stock.Industry}
              </h3>
              <h5 className="text-muted">{stock.AssetType}</h5>

              <div>
                {stock.Description}
              </div>
            </Container>
          ) : (
            <Container className="m-2">
              <h5 className="text-muted">
                Search for a stock in the search bar...
              </h5>
            </Container>
          )}
          <Button onClick={() => console.log(stock)}>asdsad</Button>
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
