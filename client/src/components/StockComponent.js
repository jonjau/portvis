import React from "react";
import { Row, Container, Badge } from "react-bootstrap";

function StockComponent(props) {
  const stock = props.searchedStock;

  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        {stock ? (
          <Container className="m-2">
            {stock.description ? (
              <>
                <h1>
                  {/* FIXME:  why is Symbol not symbol.*/}
                  <Badge variant="dark">{stock.symbol}</Badge>
                  &nbsp; {stock.Name}
                </h1>
                <h3 className="text-muted">
                  {stock.sector} | {stock.industry}
                </h3>
                <h5 className="text-muted">{stock.assetType}</h5>
                <div>{stock.description}</div>
              </>
            ) : (
              <h4 className="text-muted text-center">
                No information found for this stock.
              </h4>
            )}
          </Container>
        ) : (
          <Container className="m-2">
            <h4 className="text-muted text-center">
              Search for a stock in the search bar...
            </h4>
          </Container>
        )}
      </Container>
    </Row>
  );
}

export default StockComponent;
