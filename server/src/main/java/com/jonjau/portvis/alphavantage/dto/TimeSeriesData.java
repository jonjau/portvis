package com.jonjau.portvis.alphavantage.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TimeSeriesData {

    private BigDecimal open;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal close;
    private BigDecimal volume;
}