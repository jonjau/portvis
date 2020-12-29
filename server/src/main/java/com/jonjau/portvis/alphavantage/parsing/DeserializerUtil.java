package com.jonjau.portvis.alphavantage.parsing;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

import com.fasterxml.jackson.databind.JsonNode;

import static com.jonjau.portvis.alphavantage.dto.MetaData.META_DATA_RESPONSE_KEY;

import com.jonjau.portvis.alphavantage.dto.MetaData;
import com.jonjau.portvis.util.DateUtil;

/**
 * DeserializerHelper
 * Utility Class
 */
public final class DeserializerUtil {

    /**
     * @param jsonNode
     * @return TODO: JAVADOCS, make all the classes final...
     */
    public static Map<String, Object> sanitizeNodeKeys(JsonNode jsonNode) {
        Map<String, Object> sanitizedNodes = new HashMap<>();
        jsonNode.fields().forEachRemaining(node -> {
            String regexMatch = RegexUtil.getMatch(REMOVE_NUMBER_REGEX, node.getKey());
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

    public static <T> Map<LocalDate, T> getDateObjectMap(JsonNode jsonNode, Class<T> resultObject) {

        // TreeMap ensures sorted order
        Map<LocalDate, T> dateObjectMap = new TreeMap<>();

        jsonNode.fields().forEachRemaining(nodeEntry -> {
            // ignore metadata, only want actual data
            if (nodeEntry.getKey().equals(META_DATA_RESPONSE_KEY)) {
                return;
            }
            nodeEntry.getValue().fields().forEachRemaining(timeSeriesEntry -> {
                // dataNodes: e.g. for time series: high, low, open, volume, etc.
                Map<String, Object> dataNodes = sanitizeNodeKeys(timeSeriesEntry.getValue());
                try {
                    LocalDate date = DateUtil.parseDate(timeSeriesEntry.getKey());
                    T data = JsonParser.toObject(JsonParser.toJson(dataNodes), resultObject);
                    dateObjectMap.put(date, data);
                } catch (IOException | DateTimeParseException e) {
                    e.printStackTrace();
                }
            });
        });
        return dateObjectMap;
    }

    public static <T> List<T> getObjectList(JsonNode jsonNode, Class<T> resultObject) {
        List<T> objectList = new ArrayList<>();

        jsonNode.fields().forEachRemaining(nodeEntry -> {
                JsonNode arrNode = nodeEntry.getValue();
                if (arrNode.isArray()) {
                    for (JsonNode dataNode : arrNode) {
                        try {
                            T data =
                            JsonParser.toObject(JsonParser.toJson(sanitizeNodeKeys(dataNode)),
                            resultObject);
                            objectList.add(data);
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
        });
        return objectList;
    }

    private static final String REMOVE_NUMBER_REGEX = "\\d*.\\s(.*)";
}