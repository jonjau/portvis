package com.jonjau.portvis;

import java.io.IOException;
import java.net.URI;

import com.jonjau.portvis.company.Company;
import com.jonjau.portvis.search.SymbolSearchDeserializer;
import com.jonjau.portvis.search.SymbolSearchResult;
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
        JsonParser.addDeserializer(SymbolSearchResult.class, new SymbolSearchDeserializer());
    }

    // Get/put from/into a Cache called timeSeriesResults, check before sending request to
    // the Alphavantage API: this can potentially save a lot of time.
    // #result is written in SpEL, Spring Expression Language, it means
    // "the variable with the name 'symbol'"
    @Cacheable(value="timeSeriesResults", key="#symbol")
    public TimeSeriesResult getTimeSeriesResult(String symbol, String apiKey) throws IOException {
        return sendRequest(symbol, TimeSeriesResult.class, apiKey);
    }

    public SymbolSearchResult getSymbolSearchResult(String keywords, String apiKey) throws IOException {
        return getSymbolSearch(keywords, apiKey);
    }

    public Company getCompanyOverviewResult(String symbol, String apiKey) throws IOException {
        return getCompanyOverview(symbol, apiKey);
    }

    private <T> T sendRequest(String queryParamString, Class<T> resultObject, String apiKey)
            throws IOException{

        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 2048)).build();
        WebClient webClient = WebClient.builder().exchangeStrategies(exchangeStrategies).build();
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
            .host("www.alphavantage.co").path("/query")
            .queryParam("function", "TIME_SERIES_DAILY")
            .queryParam("symbol", queryParamString)
            .queryParam("outputsize", "full")
            .queryParam("apikey", apiKey).build().toUri();

        // this is blocking code: slow
        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, resultObject);
    }

    private SymbolSearchResult getSymbolSearch(String symbol, String apiKey) throws IOException {
        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 2048)).build();
        WebClient webClient = WebClient.builder().exchangeStrategies(exchangeStrategies).build();
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
                .host("www.alphavantage.co").path("/query")
                .queryParam("function", "SYMBOL_SEARCH")
                .queryParam("keywords", symbol)
                .queryParam("apikey", apiKey).build().toUri();

        // this is blocking code: slow
        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, SymbolSearchResult.class);
    }

    private Company getCompanyOverview(String symbol, String apiKey) throws IOException {
        ExchangeStrategies exchangeStrategies = ExchangeStrategies.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 2048)).build();
        WebClient webClient = WebClient.builder().exchangeStrategies(exchangeStrategies).build();
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
                .host("www.alphavantage.co").path("/query")
                .queryParam("function", "OVERVIEW")
                .queryParam("symbol", symbol)
                .queryParam("apikey", apiKey).build().toUri();

        String json = webClient.get().uri(uri).retrieve().bodyToMono(String.class).block();

        return JsonParser.toObject(json, Company.class);
    }
}