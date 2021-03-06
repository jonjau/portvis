package com.jonjau.portvis.alphavantage.dto;

import lombok.Data;

/**
 * An item in the response from the AlphaVantage symbol search endpoint.
 */
@Data
public class SymbolSearchResultItem {

    private String symbol;
    private String name;
    private String type;
    private String region;
    private String marketOpen;
    private String marketClose;
    private String timezone;
    private String currency;
    private String matchScore;
}
