package com.jonjau.portvis.controller;

import com.jonjau.portvis.alphavantage.dto.Company;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResult;
import com.jonjau.portvis.exception.CompanyNotFoundException;
import com.jonjau.portvis.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api")
public class SearchController {
    private final SearchService searchService;

    @Autowired
    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping(value = "/search", params = {"keywords"})
    public SymbolSearchResult getSymbolSearch(
            @RequestParam("keywords") String keywords,
            @RequestAttribute String apiKey
    ) throws IOException {

        return searchService.getSymbolSearch(keywords, apiKey);
    }

    @GetMapping(value = "/search", params = {"company"})
    public Company getCompanyOverview(
            @RequestParam("company") String symbol,
            @RequestAttribute String apiKey
    ) throws IOException, CompanyNotFoundException {

        return searchService.getCompanyOverview(symbol, apiKey);
    }
}
