package com.jonjau.portvis.alphavantage.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * An item in the response from the AlphaVantage time series data endpoint.
 */
@Data
public class TimeSeriesResultItem {

    private BigDecimal open;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal close;
    private BigDecimal volume;
}