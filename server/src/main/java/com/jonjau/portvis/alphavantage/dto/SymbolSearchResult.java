package com.jonjau.portvis.alphavantage.dto;

import lombok.Data;

import java.util.List;

/**
 * Response from the AlphaVantage symbol search endpoint.
 */
@Data
public class SymbolSearchResult {

    private List<SymbolSearchResultItem> bestMatches;
}
