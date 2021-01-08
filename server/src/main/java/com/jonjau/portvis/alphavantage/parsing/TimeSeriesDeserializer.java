package com.jonjau.portvis.alphavantage.parsing;

import java.io.IOException;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResultItem;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;

public class TimeSeriesDeserializer extends JsonDeserializer<TimeSeriesResult> {

    @Override
    public TimeSeriesResult deserialize(
            com.fasterxml.jackson.core.JsonParser parser,
            DeserializationContext context
    ) throws IOException {

        TimeSeriesResult timeSeriesResult = new TimeSeriesResult();
        ObjectCodec objectCodec = parser.getCodec();
        JsonNode node = objectCodec.readTree(parser);
        timeSeriesResult.setMetaData(DeserializerUtil.getMetaData(node));
        timeSeriesResult.setTimeSeries(DeserializerUtil.getDateObjectMap(
                node, TimeSeriesResultItem.class));
        return timeSeriesResult;
    }


}