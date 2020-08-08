import React, { useState, useRef } from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";

import SearchService from "../service/SearchService";

function StockSearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);

  const ref = useRef();

  const handleSearch = (query) => {
    setIsLoading(true);

    SearchService.getSymbols(query).then((response) => {
      console.log(query);
      const options = response.data.bestMatches.map((result) => ({
        symbol: String(result.symbol),
        name: String(result.name),
      }));

      setOptions(options);
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    //FIXME: get company overview
    const symbol = ref.current.state.text;
    alert(symbol);

  };

  return (
    <Form inline>
      <AsyncTypeahead
        id="stock-search"
        isLoading={isLoading}
        ref={ref}
        className="m-2"
        labelKey="symbol"
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a US stock..."
        renderMenuItemChildren={(option, props) => (
          <span>
            {option.symbol} ({option.name})
          </span>
        )}
      />
      <Button variant="outline-info" onClick={handleSubmit}>
        Get overview
      </Button>
      <Button onClick={() => console.log(ref.current.state.text)}>aaa</Button>
    </Form>
  );
}

export default StockSearch;
