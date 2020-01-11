package com.jonjau.portvis.api;

import java.io.IOException;
import java.net.URI;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.timeseries.TimeSeriesData;
import com.jonjau.portvis.timeseries.TimeSeriesResult;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.extern.slf4j.Slf4j;
import reactor.core.publisher.Mono;

/**
 * TimeSeriesController
 */
@RestController
@Slf4j
public class TimeSeriesController {

    private final AlphaVantageClient client;

    public TimeSeriesController() {
        this.client = new AlphaVantageClient();
    }

    private TimeSeriesData parseDaily(String jsonString) {
        ObjectMapper mapper = new ObjectMapper();
        //JsonNode rootNode = mapper.readTree(jsonString);

        return null;
    }

    @GetMapping(value = "/query", params = { "symbol", "apikey" })
    public TimeSeriesResult getDaily() throws IOException {

        TimeSeriesResult data = client.getTimeSeries();
        log.info(data.toString());
        return data;

        // tsdflux.subscribe(flux -> log.info(flux));
        // return new TimeSeriesDaily(1.0,2.3,4.5,5.6,7.909090);
    }
}