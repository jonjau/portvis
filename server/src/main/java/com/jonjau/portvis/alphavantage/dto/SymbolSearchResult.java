package com.jonjau.portvis.alphavantage.dto;

import lombok.Data;

import java.util.List;

@Data
public class SymbolSearchResult {

    private List<Symbol> bestMatches;
}
