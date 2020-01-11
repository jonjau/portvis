package com.jonjau.portvis;

import java.io.IOException;
import java.net.URI;

import com.jonjau.portvis.timeseries.TimeSeriesData;
import com.jonjau.portvis.timeseries.TimeSeriesDeserializer;
import com.jonjau.portvis.timeseries.TimeSeriesResult;
import com.jonjau.portvis.utils.JsonParser;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * AlphaVantageClient
 */
public class AlphaVantageClient {

    public AlphaVantageClient() {
        JsonParser.addDeserializer(TimeSeriesResult.class, new TimeSeriesDeserializer());
    }

    public TimeSeriesResult getTimeSeries() throws IOException {
        return sendRequest("lorem ipsum", TimeSeriesResult.class);
    }

    private <T> T sendRequest(String queryParamString, Class<T> resultObject) 
            throws IOException{
        WebClient webClient = WebClient.create();
        URI uri = UriComponentsBuilder.newInstance().scheme("https")
            .host("www.alphavantage.co").path("/query")
            .queryParam("function", "TIME_SERIES_DAILY")
            .queryParam("symbol", "MSFT")
            .queryParam("apikey", "A35DBK43HPJPIB03").build().toUri();

        String json = webClient.get().uri(uri).retrieve()
                .bodyToMono(String.class).block();
        System.out.println("hkdfhksdhfjksd_________------____");
        return JsonParser.toObject(json, resultObject);
    }
}