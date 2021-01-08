package com.jonjau.portvis.service;

import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Service responsible for fetching time series data.
 */
@Service
public class TimeSeriesService {

    private final AlphaVantageClient client;

    @Autowired
    public TimeSeriesService(AlphaVantageClient client) {
        this.client = client;
    }

    /**
     * Returns the daily (unadjusted) prices for the given symbol.
     */
    public TimeSeriesResult getDaily(String symbol, String apiKey) throws IOException {
        return client.getTimeSeriesResult(symbol, apiKey);
    }

}