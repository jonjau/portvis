package com.jonjau.portvis.alphavantage.parsing;

import java.io.IOException;

import com.fasterxml.jackson.core.ObjectCodec;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesData;
import com.jonjau.portvis.alphavantage.dto.TimeSeriesResult;
import lombok.extern.slf4j.Slf4j;


/**
 * TimeSeriesDailyDeserializer
 */
@Slf4j
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
            log.error("Error when deserializing:");
            log.error(node.toPrettyString());
            throwable.printStackTrace();
        }
        return timeSeriesResult;
    }


}