package com.jonjau.portvis.timeseries;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TimeSeriesDaily
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSeriesData {

    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
}