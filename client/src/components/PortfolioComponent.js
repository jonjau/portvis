import React, { Component } from "react";
import { ListGroup, Row, Col, Button, Nav } from "react-bootstrap";
import AllocationTable from "./AllocationTable";
import PortfolioService from "../service/PortfolioService";
import { Route, Switch, Link } from "react-router-dom";

class PortfolioComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      portfolios: [],
      isLoading: true,
    };

    this.refreshPortfolios = this.refreshPortfolios.bind(this);
  }

  componentDidMount() {
    //this.refreshPortfolios();
  }

  refreshPortfolios() {
    PortfolioService.getAllPortfolios()
      .then((response) => {
        console.log(`received: ${JSON.stringify(response.data, null, 2)}`);
        this.setState({ portfolios: response.data });
      })
      .catch((error) =>
        console.log(`error: ${JSON.stringify(error, null, 2)}`)
      );
  }

  render() {
    const { match, location } = this.props;
    return (
      <Row>
        <Col md={2} className="bg-secondary p-2 vh-100">
          <Nav
            as={ListGroup}
            activeKey={location.pathname}
            className="flex-column"
          >
            <Nav.Link
              as={ListGroup.Item}
              variant="dark"
              action
              eventKey="/39"
              onClick={() => this.props.history.push(`/portfolios/39`)}
            >
              Portfolio 1
              <Link to={`${match.url}/39`}> aa</Link>
            </Nav.Link>
            <Nav.Link
              as={ListGroup.Item}
              variant="dark"
              action
              eventKey="/42"
              onClick={() => this.props.history.push(`/portfolios/42`)}
            >
              Portfolio 2
              <Link to={`${match.url}/42`}> aa</Link>
            </Nav.Link>
            <Nav.Link as={ListGroup.Item} variant="dark" action>
              Link
            </Nav.Link>
            <ListGroup.Item disable="true" variant="secondary">
              <Button className="btn-info">Add new portfolio</Button>
            </ListGroup.Item>
          </Nav>
        </Col>
        <Col md={10} className="p-4">
          <Route
            path={`${this.props.match.path}/:portfolioId`}
            component={AllocationTable}
          />
          <Button onClick={this.refreshPortfolios}>refresh</Button>
        </Col>
      </Row>
    );
  }
}

export default PortfolioComponent;

//<ListGroup>
//<ListGroup.Item action variant="dark">
//  <Link to="/portfolios/39">Portfolio 1</Link>
//</ListGroup.Item>
//<ListGroup.Item action variant="dark">
//  Link 2
//</ListGroup.Item>
//<ListGroup.Item variant="dark">
//  <Button>Add new portfolio</Button>
//</ListGroup.Item>
//</ListGroup>
