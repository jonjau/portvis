package com.jonjau.portvis.alphavantage.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import lombok.Data;

@Data
public class MetaData {

  @JsonAlias("Information")
  private String information;

  @JsonAlias("Symbol")
  private String symbol;

  @JsonAlias("Output Size")
  private String outputSize;

  @JsonAlias(TIMEZONE_KEY)
  private String timezone;

  @JsonAlias("Last Refreshed")
  private String lastRefreshed;

  @JsonAlias("Interval")
  private String interval;

  @JsonAlias("Notes")
  private String notes;

  @JsonAlias("From Symbol")
  private String fromCurrency;

  @JsonAlias("To Symbol")
  private String toCurrency;

  public static final String META_DATA_RESPONSE_KEY = "Meta Data";

  // Timezone information unused
  public static final String TIMEZONE_KEY = "Time Zone";
}