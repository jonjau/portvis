package com.jonjau.portvis.timeseries;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import lombok.Data;

/**
 * TimeSeriesResult
 */
@Data
public class TimeSeriesResult {

    private MetaData metaData;
    private Map<LocalDate, TimeSeriesData> timeSeries;
}