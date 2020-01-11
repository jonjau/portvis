package com.jonjau.portvis.timeseries;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
  @JsonProperty("Output Size")
  private String outputSize;
  @JsonProperty("Time Zone")
  private String timezone;
  @JsonProperty("Last Refreshed")
  private String lastRefreshed;
  @JsonProperty("Interval")
  private String interval;
  @JsonProperty("Notes")
  private String notes;
  @JsonProperty("From Symbol")
  private String fromCurrency;
  @JsonProperty("To Symbol")
  private String toCurrency;

  public static final String META_DATA_RESPONSE_KEY = "Meta Data";
}