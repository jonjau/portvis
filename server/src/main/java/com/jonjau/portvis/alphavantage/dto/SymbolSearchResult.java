package com.jonjau.portvis.alphavantage.dto;

import com.jonjau.portvis.alphavantage.dto.Symbol;
import lombok.Data;

import java.util.List;

@Data
public class SymbolSearchResult {

    private List<Symbol> bestMatches;
}
