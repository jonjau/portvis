package com.jonjau.portvis.timeseries;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * TimeSeriesDaily
 */
@Data
@AllArgsConstructor
public class TimeSeriesData {

    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
}