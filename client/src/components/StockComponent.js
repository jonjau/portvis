import React from "react";
import { Row, Container, Badge } from "react-bootstrap";

function StockComponent(props) {
  const stock = props.searchedStock;

  return (
    <Row className="bg-secondary min-vh-100">
      <Container className="bg-light min-vh-100">
        {stock ? (
          <Container className="m-2">
            {stock.Description ? (
              <>
                <h1>
                  {/* FIXME:  why is Symbol not symbol.*/}
                  <Badge variant="dark">{stock.Symbol}</Badge>
                  &nbsp; {stock.Name}
                </h1>
                <h3 className="text-muted">
                  {stock.Sector} | {stock.Industry}
                </h3>
                <h5 className="text-muted">{stock.AssetType}</h5>
                <div>{stock.Description}</div>
              </>
            ) : (
              <h5 className="text-muted text-center">
                No information found for this stock.
              </h5>
            )}
          </Container>
        ) : (
          <Container className="m-2">
            <h5 className="text-muted text-center">
              Search for a stock in the search bar...
            </h5>
          </Container>
        )}
      </Container>
    </Row>
  );
}

export default StockComponent;
