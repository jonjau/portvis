package com.jonjau.portvis.search;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.utils.DeserializerUtil;

import java.io.IOException;

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
            System.out.println("Error when deserializing:");
            System.out.println(node.toString());
            throwable.printStackTrace();
        }
        return symbolSearchResult;
    }
}
