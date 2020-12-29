package com.jonjau.portvis.controller;

import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class TimeSeriesController {

    private final AlphaVantageClient client;

    @Autowired
    public TimeSeriesController() {
        this.client = new AlphaVantageClient();
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/query", params = {"symbol", "apiKey"})
    public TimeSeriesResult getDaily(
            @RequestParam("symbol") String symbol,
            @RequestParam("apiKey") String apiKey
    ) throws IOException {

        //ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
        //.codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024)).build();
        //WebClient webClient = WebClient.builder().exchangeStrategies(exchangeStrategies).build();
        ////WebClient webClient = WebClient.create();
        //URI uri = UriComponentsBuilder.newInstance().scheme("https")
        //.host("api.worldtradingdata.com").path("/api/v1/history")
        //.queryParam("symbol", "MSFT")
        //.queryParam("api_token", "36DBZa2FGaP0vPs11p3qihkrW3ZnVl4JpEZTzZtLGJgcyLBCqXod093xbFUB").build().toUri();

        //log.info(uri.toString());
        //String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();
        //log.info(json);

        //log.info(data.toString());

        return client.getTimeSeriesResult(symbol, apiKey);
    }
}