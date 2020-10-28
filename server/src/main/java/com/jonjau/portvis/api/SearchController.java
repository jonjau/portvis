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

@RestController
public class SearchController {
    private final AlphaVantageClient client;

    @Autowired
    public SearchController(AlphaVantageClient client) {
        this.client = client;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/query", params = { "keywords", "apikey" })
    public SymbolSearchResult getSymbolSearch(@RequestParam("keywords") String keywords)
            throws IOException {

        SymbolSearchResult data = client.getSymbolSearchResult(keywords);

        return data;
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(value = "/query", params = { "company", "apikey" })
    public Company getCompanyOverview(@RequestParam("company") String symbol)
            throws IOException {

        Company data = client.getCompanyOverviewResult(symbol);
        System.out.println(data.toString());

        return data;
    }
}
