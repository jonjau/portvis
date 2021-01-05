import React from "react";
import { Card } from "react-bootstrap";

const RemarksCard = () => {
  return (
    <Card className="m-4">
      <Card.Header>
        <h4>Assumptions and remarks</h4>
      </Card.Header>
      <Card.Body>
        <ul>
          <li>
            Fetching price data for diverse portfolios is slow (a few seconds
            for each distinct stock).
          </li>
          <li>The price metric used for each period is the OHLC average.</li>
          <li>Returns from assets are compounded daily.</li>
          <li>Portfolios are rebalanced daily.</li>
          <li>No fees associated with rebalancing.</li>
          <li>Prices are not adjusted after stock splits.</li>
          <li>
            Figures are approximate (significant deviation for larger date
            ranges).
          </li>
        </ul>
      </Card.Body>
    </Card>
  );
};

export default RemarksCard;
