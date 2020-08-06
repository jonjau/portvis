package com.jonjau.portvis;

import java.io.IOException;
import java.net.URI;

import com.jonjau.portvis.timeseries.TimeSeriesDeserializer;
import com.jonjau.portvis.timeseries.TimeSeriesResult;
import com.jonjau.portvis.utils.JsonParser;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
     * AlphaVantageClient
 */
@Component
public class AlphaVantageClient {

    public AlphaVantageClient() {
        JsonParser.addDeserializer(TimeSeriesResult.class, new TimeSeriesDeserializer());
    }

    // Get/put from/into a Cache called timeSeriesResults, check before sending request to
    // the Alphavantage API: this can potentially save a lot of time.
    // #result is written in SpEL, Spring Expression Language, it means
    // "the variable with the name 'symbol'"
    @Cacheable(value="timeSeriesResults", key="#symbol")
    public TimeSeriesResult getTimeSeriesResult(String symbol) throws IOException {
        return sendRequest(symbol, TimeSeriesResult.class);
    }

    private <T> T sendRequest(String queryParamString, Class<T> resultObject) 
            throws IOException{

        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 2048)).build();
        WebClient webClient = WebClient.builder().exchangeStrategies(exchangeStrategies).build();
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
            .host("www.alphavantage.co").path("/query")
            .queryParam("function", "TIME_SERIES_DAILY")
            .queryParam("symbol", queryParamString)
            .queryParam("outputsize", "full")
            .queryParam("apikey", "D2D48LZKE59QAB83").build().toUri();

        // this is blocking code: slow
        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, resultObject);
    }
}