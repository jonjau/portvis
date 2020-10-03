package com.jonjau.portvis.timeseries;

import java.io.IOException;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.utils.DeserializerUtil;

/**
 * TimeSeriesDailyDeserializer
 */
public class TimeSeriesDeserializer extends JsonDeserializer<TimeSeriesResult> {

    @Override
    public TimeSeriesResult deserialize(com.fasterxml.jackson.core.JsonParser parser,
                                        DeserializationContext context) throws IOException {

        TimeSeriesResult timeSeriesResult = new TimeSeriesResult();
        ObjectCodec objectCodec = parser.getCodec();
        JsonNode node = objectCodec.readTree(parser);
        try {
            timeSeriesResult.setMetaData(DeserializerUtil.getMetaData(node));
            timeSeriesResult.setTimeSeries(
                DeserializerUtil.getDateObjectMap(node, TimeSeriesData.class)
            );
        } catch (final Throwable throwable) {
            System.out.println("Error when deserializing:");
            System.out.println(node.toString());
            throwable.printStackTrace();
        }
        return timeSeriesResult;
    }
}