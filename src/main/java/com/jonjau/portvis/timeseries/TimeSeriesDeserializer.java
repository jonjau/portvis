package com.jonjau.portvis.timeseries;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * TimeSeriesDailyDeserializer
 */
public class TimeSeriesDeserializer extends JsonDeserializer<TimeSeriesResult> {

    @Override
    public TimeSeriesResult deserialize(
            com.fasterxml.jackson.core.JsonParser parser,
            DeserializationContext context) throws IOException {
        
        TimeSeriesResult timeSeriesResult = new TimeSeriesResult();
        ObjectCodec objectCodec = parser.getCodec();
        JsonNode node = objectCodec.readTree(parser);
        try {
           timeSeriesResult.setMetaData(getMetaData(node));
        } catch (Exception e) {
            //TODO: handle exception
        }

        return null;
    }

    private MetaData getMetaData(JsonNode node) {
        Map<String, Object> sanitizedNodes;
    }
}