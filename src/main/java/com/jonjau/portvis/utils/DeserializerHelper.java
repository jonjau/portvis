package com.jonjau.portvis.utils;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

import com.fasterxml.jackson.databind.JsonNode;

import static com.jonjau.portvis.timeseries.MetaData.META_DATA_RESPONSE_KEY;
import com.jonjau.portvis.timeseries.MetaData;

/**
 * DeserializerHelper
 */
public class DeserializerHelper {

    /**
     * 
     * @param jsonNode
     * @return TODO: JAVADOC
     */
    public static Map<String, Object> sanitizeNodeKeys(JsonNode jsonNode) {
        Map<String, Object> sanitizedNodes = new HashMap<>();
        jsonNode.fields().forEachRemaining(node -> {
            String regexMatch = Regex.getMatch(REMOVE_NUMBER_REGEX, node.getKey());
            // remove leading numbers from JSON property names (if any)
            if (regexMatch != null) {
                sanitizedNodes.put(regexMatch, node.getValue());
            } else {
                sanitizedNodes.put(node.getKey(), node.getValue());
            }
        });
        return sanitizedNodes;
    }

    public static MetaData getMetaData(JsonNode jsonNode) throws IOException {
        // sanitize entries in MetaData property
        Map<String, Object> sanitizedNodes = sanitizeNodeKeys(jsonNode.get(META_DATA_RESPONSE_KEY));
        return JsonParser.toObject(JsonParser.toJson(sanitizedNodes), MetaData.class);
    }

    public static <T> Map<Date, T> getDateObjectMap(JsonNode jsonNode, Class<T> resultObject) {

        Map<Date, T> dateObjectMap = new TreeMap<>();
        jsonNode.fields().forEachRemaining(nodeEntry -> {
            // ignore metadata, only want time series data
            if (nodeEntry.getKey().equals(META_DATA_RESPONSE_KEY)) {
                return;
            }
            nodeEntry.getValue().fields().forEachRemaining(timeSeriesEntry -> {
                // dataNodes: high, low, open, volume, etc.
                Map<String, Object> dataNodes = sanitizeNodeKeys(timeSeriesEntry.getValue());
                try {
                    Date date = parseDate(timeSeriesEntry.getKey());
                    T data = JsonParser.toObject(JsonParser.toJson(dataNodes), resultObject);
                    dateObjectMap.put(date, data);
                } catch (IOException | ParseException e) {
                    e.printStackTrace();
                }
            });
        });
        return dateObjectMap;
    }

    private static Date parseDate(String dateString)
            throws ParseException {
        Date date = DATE_PARSER.parse(dateString);
        if (dateString.length() > DATE_FORMAT.length()) {
            date = DATE_TIME_PARSER.parse(dateString);
        }
        return date;
    }

    private static final String REMOVE_NUMBER_REGEX = "\\d*.\\s(.*)";

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:SS";
    private static final String DATE_FORMAT = "yyyy-MM-dd";

    private static final SimpleDateFormat DATE_TIME_PARSER = new SimpleDateFormat(DATE_FORMAT);
    private static final SimpleDateFormat DATE_PARSER = new SimpleDateFormat(DATE_TIME_FORMAT);
}