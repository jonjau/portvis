package com.jonjau.portvis.alphavantage.parsing;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.alphavantage.dto.Symbol;
import com.jonjau.portvis.alphavantage.dto.SymbolSearchResult;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

@Slf4j
public class SymbolSearchDeserializer extends JsonDeserializer<SymbolSearchResult> {

    @Override
    public SymbolSearchResult deserialize(com.fasterxml.jackson.core.JsonParser parser,
                                          DeserializationContext context) throws IOException {

        SymbolSearchResult symbolSearchResult = new SymbolSearchResult();
        ObjectCodec objectCodec = parser.getCodec();
        JsonNode node = objectCodec.readTree(parser);
        try {
            symbolSearchResult.setBestMatches( DeserializerUtil.getObjectList(node, Symbol.class));
        } catch (final Throwable throwable) {
            log.error("Error when deserializing:");
            log.error(node.toPrettyString());
            throwable.printStackTrace();
        }
        return symbolSearchResult;
    }
}
