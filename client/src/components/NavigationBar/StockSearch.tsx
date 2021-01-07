import React, { useState, useRef } from "react";

import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { Button, Form } from "react-bootstrap";

import SearchService from "../../services/SearchService";
import { useHistory } from "react-router-dom";

interface StockSearchOption {
  symbol: string;
  name: string;
}

interface Props {
  handleStockSearch: (symbol: string) => void;
}

const StockSearch = (props: Props) => {
  const [, setIsLoading] = useState(false);
  const [options, setOptions] = useState<StockSearchOption[]>([]);

  const ref = useRef<AsyncTypeahead<StockSearchOption>>(null);
  const history = useHistory();

  const handleSearch = (query: string) => {
    setIsLoading(true);

    SearchService.getSymbols(query).then((response) => {
      const options: StockSearchOption[] = response.data.bestMatches.map(
        (result) => ({
          symbol: String(result.symbol),
          name: String(result.name),
        })
      );

      setOptions(options);
      setIsLoading(false);
    });
  };

  const handleSubmit = () => {
    // nasty
    const symbol = (ref?.current?.state as any).text;
    history.push("/stocks/");
    props.handleStockSearch(symbol);
  };

  return (
    <Form inline>
      <AsyncTypeahead
        id="stock-search"
        isLoading={false}
        ref={ref}
        labelKey="symbol"
        onSearch={handleSearch}
        options={options}
        placeholder="Search for a US stock..."
        renderMenuItemChildren={(option, _props) => (
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
};

export default StockSearch;
