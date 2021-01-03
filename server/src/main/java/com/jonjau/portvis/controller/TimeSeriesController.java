package com.jonjau.portvis.controller;

import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

/**
 * TimeSeriesController
 */
@RestController
public class TimeSeriesController {

    private final AlphaVantageClient client;

    @Autowired
    public TimeSeriesController() {
        this.client = new AlphaVantageClient();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/timeseries", params = {"symbol", "apiKey"})
    public TimeSeriesResult getDaily(
            @RequestParam("symbol") String symbol,
            @RequestParam("apiKey") String apiKey
    ) throws IOException {
        return client.getTimeSeriesResult(symbol, apiKey);
    }
}