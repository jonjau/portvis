import React from "react";
import { Table, Button, Row, Col } from "react-bootstrap";

import AssetForm from "./AssetForm";
import PortfolioDetailsForm from "./PortfolioDetailsForm";

import _ from "lodash";

function PortfolioEditComponent(props) {
  // this.props or props are undefined in contructor(props).
  // In render they aren't. Also, setting state in componentDidUpdate is a
  // bad idea. Google "react you probably don't need derived state".

  const {
    currentPortfolio,
    addAssetClicked,
    deleteAssetClicked,
    portfolioDetailsSubmitted,
  } = props;
  // Doesn't have to be called submitAction
  //FIXME: overflow and ellipsis for table and portfolio sidenav
  // FIXME: allocations must add up to 1
  // FIXME: asset search endpoints
  return (
    <>
      <Row>
        <Col>
          <PortfolioDetailsForm
            currentPortfolio={currentPortfolio}
            submitAction={portfolioDetailsSubmitted}
          />
        </Col>
        <Col>
          <AssetForm
            submitAction={addAssetClicked}
            // turn {s1: p1, s2: p2} into [s1, s2]
            assetSymbols={Object.keys(currentPortfolio.allocations)}
            totalAllocation={_.sum(Object.values(currentPortfolio.allocations))}
          />
        </Col>
      </Row>
      <Row>
        <Table bordered hover className="col-9 table-condensed">
          <thead>
            <tr className="d-flex">
              <th className="col-3">Asset</th>
              <th className="col-3">Proportion</th>
              <th className="col-3">Allocation (USD)</th>
              <th className="col-3"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(currentPortfolio.allocations).map(
              ([symbol, proportion]) => (
                // symbol must be unique! Validated with Yup via Formik
                // https://reactjs.org/docs/lists-and-keys.html#keys
                // truncates allocation values to nearest cent
                <tr className="d-flex" key={symbol}>
                  <td className="col-3">{symbol}</td>
                  <td className="col-3">{`${proportion * 100}%`}</td>
                  <td className="col-3">{`${(
                    proportion * currentPortfolio.initialValue
                  ).toFixed(2)}`}</td>
                  <td className="col-3">
                    <Button
                      className="btn-danger"
                      onClick={() => deleteAssetClicked(symbol)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </Table>
      </Row>
    </>
  );
}

export default PortfolioEditComponent;
