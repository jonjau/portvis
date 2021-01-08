package com.jonjau.portvis.alphavantage.dto;

import java.time.LocalDate;
import java.util.Map;

import lombok.Data;

/**
 * Response from the AlphaVantage time series data endpoint.
 */
@Data
public class TimeSeriesResult {

    private MetaData metaData;
    private Map<LocalDate, TimeSeriesResultItem> timeSeries;
}