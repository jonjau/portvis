import React, { useState, useRef } from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";

import SearchService from "../service/SearchService";
import { Redirect } from "react-router-dom";

function StockSearch(props) {
  const [, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const ref = useRef();

  const handleSearch = (query) => {
    setIsLoading(true);

    SearchService.getSymbols(query).then((response) => {
      const options = response.data.bestMatches.map((result) => ({
        symbol: String(result.symbol),
        name: String(result.name),
        //symbol_and_name: String(result.symbol) + String(result.name),
      }));

      setOptions(options);
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    //FIXME: get company overview
    const symbol = ref.current.state.text;
    props.handleStockSearch(symbol);
  };

  return (
    <Form inline>
      <AsyncTypeahead
        id="stock-search"
        isLoading={false}
        ref={ref}
        className="m-2"
        labelKey="symbol"
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a US stock..."
        renderMenuItemChildren={(option, props) => (
          <div>
            {option.symbol} ({option.name})
          </div>
        )}
      />
      <Button variant="outline-info" onClick={handleSubmit}>
        Get overview
      </Button>
    </Form>
  );
}

export default StockSearch;
