package com.jonjau.portvis.service;

import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import com.jonjau.portvis.alphavantage.dto.Company;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResult;
import com.jonjau.portvis.exception.CompanyNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

/**
 * Service responsible for fetching the symbol search results (used for the autocomplete
 * functionality), as well as the company overview results.
 */
@Service
public class SearchService {
    private final AlphaVantageClient client;

    @Autowired
    public SearchService(AlphaVantageClient client) {
        this.client = client;
    }

    /**
     * Returns the best matches for the given keywords.
     */
    public SymbolSearchResult getSymbolSearch(
            String keywords,
            String apiKey
    ) throws IOException {

        return client.getSymbolSearchResult(keywords, apiKey);
    }

    /**
     * Returns information about the company with the given symbol.
     */
    public Company getCompanyOverview(
            String symbol,
            String apiKey
    ) throws IOException, CompanyNotFoundException {

        Company company = client.getCompanyOverviewResult(symbol, apiKey);
        if (company.getSymbol() == null) {
            throw new CompanyNotFoundException(symbol);
        }
        return company;
    }
}
