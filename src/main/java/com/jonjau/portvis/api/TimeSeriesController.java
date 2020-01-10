package com.jonjau.portvis.api;

import java.net.URI;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jonjau.portvis.timeseries.TimeSeriesData;

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

    private final WebClient webClient;

    public TimeSeriesController() {
        this.webClient = WebClient.create();
    }

    private TimeSeriesData parseDaily(String jsonString) {
        ObjectMapper mapper = new ObjectMapper();
        JsonNode rootNode = mapper.readTree(jsonString);

        return null;
    }

    @GetMapping(value = "/query", params = { "symbol", "apikey" })
    public TimeSeriesData getDaily() {
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
                .host("www.alphavantage.co").path("/query")
                .queryParam("function", "TIME_SERIES_DAILY")
                .queryParam("symbol", "MSFT")
                .queryParam("apikey", "A35DBK43HPJPIB03").build().toUri();

        log.info(uri.toString());

        Mono<String> timeSeriesMono = webClient.get().uri(uri).retrieve()
                .bodyToMono(String.class);


        return parseDaily(timeSeriesMono.block());
        // tsdflux.subscribe(flux -> log.info(flux));
        // return new TimeSeriesDaily(1.0,2.3,4.5,5.6,7.909090);
    }
}