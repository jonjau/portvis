package com.jonjau.portvis.search;

import lombok.Data;

import java.util.List;

@Data
public class SymbolSearchResult {

    private List<Symbol> bestMatches;
}
