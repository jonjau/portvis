package com.jonjau.portvis.alphavantage.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

/**
 * Response from the AlphaVantage company search endpoint.
 */
// ignore attributes/properties that have not been defined in this class
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Company {

    // deserialize (input) either "Symbol" or "symbol", but serialize (output) always as "symbol"
    @JsonAlias("Symbol")
    private String symbol;

    @JsonAlias("AssetType")
    private String assetType;

    @JsonAlias("Name")
    private String name;

    @JsonAlias("Description")
    private String description;

    @JsonAlias("Sector")
    private String sector;

    @JsonAlias("Industry")
    private String industry;
}
