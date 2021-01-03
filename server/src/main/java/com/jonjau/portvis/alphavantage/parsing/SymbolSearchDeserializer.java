package com.jonjau.portvis.alphavantage.parsing;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResultItem;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResult;

import java.io.IOException;

public class SymbolSearchDeserializer extends JsonDeserializer<SymbolSearchResult> {

    @Override
    public SymbolSearchResult deserialize(
            com.fasterxml.jackson.core.JsonParser parser,
            DeserializationContext context
    ) throws IOException {

        SymbolSearchResult symbolSearchResult = new SymbolSearchResult();
        ObjectCodec objectCodec = parser.getCodec();
        JsonNode node = objectCodec.readTree(parser);
        symbolSearchResult.setBestMatches(DeserializerUtil.getObjectList(
                node, SymbolSearchResultItem.class));
        return symbolSearchResult;
    }
}
