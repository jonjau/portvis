package com.jonjau.portvis;

import java.io.IOException;
import java.net.URI;

import com.jonjau.portvis.timeseries.TimeSeriesDeserializer;
import com.jonjau.portvis.timeseries.TimeSeriesResult;
import com.jonjau.portvis.utils.JsonParser;

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
            .queryParam("outputsize", "compact")
            .queryParam("apikey", "6VE5CKH8CGEGU9Q4").build().toUri();

        // this is blocking code: slow
        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, resultObject);
    }
}