package com.jonjau.portvis.backtest;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BacktestRequest {

    private LocalDateTime start;
    private LocalDateTime end;

    private List<Long> portfolioIds;
}
