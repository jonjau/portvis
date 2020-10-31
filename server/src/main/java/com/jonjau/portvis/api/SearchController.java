package com.jonjau.portvis.api;

import com.jonjau.portvis.AlphaVantageClient;
import com.jonjau.portvis.company.Company;
import com.jonjau.portvis.search.SymbolSearchResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class SearchController {
    private final AlphaVantageClient client;

    @Autowired
    public SearchController(AlphaVantageClient client) {
        this.client = client;
    }

    @GetMapping(value = "/query", params = {"keywords", "apiKey"})
    public SymbolSearchResult getSymbolSearch(
            @RequestParam("keywords") String keywords,
            @RequestParam("apiKey") String apiKey)
            throws IOException {

        return client.getSymbolSearchResult(keywords, apiKey);
    }

    @GetMapping(value = "/query", params = {"company", "apiKey"})
    public Company getCompanyOverview(
            @RequestParam("company") String symbol,
            @RequestParam("apiKey") String apiKey)
            throws IOException {

        return client.getCompanyOverviewResult(symbol, apiKey);
    }
}
