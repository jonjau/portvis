package com.jonjau.portvis.alphavantage.dto;

import java.time.LocalDate;
import java.util.Map;

import com.jonjau.portvis.alphavantage.dto.MetaData;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesData;
import lombok.Data;

/**
 * TimeSeriesResult
 */
@Data
public class TimeSeriesResult {

    private MetaData metaData;
    private Map<LocalDate, TimeSeriesData> timeSeries;
}