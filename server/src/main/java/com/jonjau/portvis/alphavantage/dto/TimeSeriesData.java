package com.jonjau.portvis.alphavantage.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * TimeSeriesDaily
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSeriesData {

    private BigDecimal open;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal close;
    private BigDecimal volume;
}