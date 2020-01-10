package com.jonjau.portvis.timeseries;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

/**
 * MetaData
 */
@Data
public class MetaData {

  @JsonProperty("Information")
  private String information;
  @JsonProperty("Symbol")
  private String symbol;
  @JsonProperty("Time Zone")
  private String timezone;
  @JsonProperty("Last Refreshed")
  private String lastRefreshed;
  @JsonProperty("Notes")
  private String notes;
  @JsonProperty("From Symbol")
  private String fromCurrency;
  @JsonProperty("To Symbol")
  private String toCurrency;

  public static final String META_DATA_RESPONSE_KEY = "Meta Data";
}