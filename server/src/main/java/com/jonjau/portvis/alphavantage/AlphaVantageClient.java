package com.jonjau.portvis.alphavantage;

import java.io.IOException;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import com.jonjau.portvis.alphavantage.dto.Company;
import com.jonjau.portvis.alphavantage.parsing.SymbolSearchDeserializer;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResult;
import com.jonjau.portvis.alphavantage.parsing.TimeSeriesDeserializer;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;
import com.jonjau.portvis.alphavantage.parsing.JsonParser;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * AlphaVantage client component that sends requests to the public AlphaVantage stock price data
 * API.
 */
@Component
public class AlphaVantageClient {

    // buffer size for the retrieved data, 1 MB or lower is not enough for the time series data
    // with output size = full.
    private static final int MAX_BUFFER_SIZE_MB = 8;
    private final ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
            .codecs(configurer ->
                    configurer.defaultCodecs().maxInMemorySize(MAX_BUFFER_SIZE_MB * 1024 * 1024))
            .build();
    private final WebClient webClient =
            WebClient.builder().exchangeStrategies(exchangeStrategies).build();

    public AlphaVantageClient() {
        // register deserializers so Jackson knows how to deserialize these classes.
        JsonParser.addDeserializer(TimeSeriesResult.class, new TimeSeriesDeserializer());
        JsonParser.addDeserializer(SymbolSearchResult.class, new SymbolSearchDeserializer());
    }

    // Get/put from/into a Cache called timeSeriesResults, check before sending request to
    // the AlphaVantage API: this can potentially save a lot of time.
    // #result is SpEL, Spring Expression Language, for "the variable with the name 'symbol'"
    @Cacheable(value="timeSeriesResults", key="#symbol")
    public TimeSeriesResult getTimeSeriesResult(String symbol, String apiKey)
            throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("function", "TIME_SERIES_DAILY");
        params.put("symbol", symbol);
        params.put("outputsize", "full");
        params.put("apikey", apiKey);
        return getRequest(TimeSeriesResult.class, params);
    }

    public SymbolSearchResult getSymbolSearchResult(String keywords, String apiKey)
            throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("function", "SYMBOL_SEARCH");
        params.put("keywords", keywords);
        params.put("apikey", apiKey);
        return getRequest(SymbolSearchResult.class, params);
    }

    public Company getCompanyOverviewResult(String symbol, String apiKey)
            throws IOException {
        Map<String, String> params = new HashMap<>();
        params.put("function", "OVERVIEW");
        params.put("symbol", symbol);
        params.put("apikey", apiKey);
        return getRequest(Company.class, params);
    }

    private <T> T getRequest(
            Class<T> resultObject,
            Map<String, String> queryParams
    ) throws IOException {

        UriComponentsBuilder uriComponentsBuilder = UriComponentsBuilder.newInstance()
                .scheme("https").host("www.alphavantage.co").path("/query");
        for (Map.Entry<String, String> param : queryParams.entrySet()) {
            uriComponentsBuilder.queryParam(param.getKey(), param.getValue());
        }
        URI uri = uriComponentsBuilder.build().toUri();

        // this is blocking code: slow but simple
        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, resultObject);
    }
}