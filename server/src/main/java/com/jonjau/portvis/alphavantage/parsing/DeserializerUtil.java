package com.jonjau.portvis.alphavantage.parsing;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

import com.fasterxml.jackson.databind.JsonNode;

import static com.jonjau.portvis.alphavantage.dto.MetaData.META_DATA_RESPONSE_KEY;

import com.jonjau.portvis.alphavantage.dto.MetaData;
import com.jonjau.portvis.util.DateUtil;

/**
 * Utility class with static methods to sanitise and convert JsonNodes from AlphaVantage output
 * to Maps and Lists
 */
public final class DeserializerUtil {



    /**
     * Remove leading numbers from the fields of this jsonNode, e.g. '1. time' becomes 'time', and
     * returns it as a map of keys to objects.
     *
     * @param jsonNode jsonNode to sanitize
     * @return map of sanitised json keys to objects
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

    /**
     * Return the meta data property in a jsonNode, as a MetaData
     *
     * @param jsonNode jsonNode from which MetaData is to be extracted
     * @return the MetaData
     * @throws IOException if no meta data property can be parsed, etc.
     */
    public static MetaData getMetaData(JsonNode jsonNode) throws IOException {
        // sanitize entries in MetaData property
        Map<String, Object> sanitizedNodes = sanitizeNodeKeys(jsonNode.get(META_DATA_RESPONSE_KEY));
        return JsonParser.toObject(JsonParser.toJson(sanitizedNodes), MetaData.class);
    }

    /**
     * Parse a mapping from LocalDates to a given class in a jsonNode if possible
     *
     * @param jsonNode jsonNode to be parsed
     * @param resultObject the class of the Object, i.e. T, in the LocalDate: T mapping
     * @return the Map
     * @throws IOException if parsing failed
     */
    public static <T> Map<LocalDate, T> getDateObjectMap(
            JsonNode jsonNode,
            Class<T> resultObject
    ) throws IOException {

        // TreeMap ensures sorted order
        Map<LocalDate, T> dateObjectMap = new TreeMap<>();

        for (Iterator<Map.Entry<String, JsonNode>> it = jsonNode.fields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> nodeEntry = it.next();

            // ignore metadata, only want actual data
            if (nodeEntry.getKey().equals(META_DATA_RESPONSE_KEY)) {
                continue;
            }

            for (Iterator<Map.Entry<String, JsonNode>> it2 = nodeEntry.getValue().fields();
                 it2.hasNext(); ) {
                Map.Entry<String, JsonNode> timeSeriesEntry = it2.next();

                // dataNodes: e.g. for time series: high, low, open, volume, etc.
                Map<String, Object> dataNodes = sanitizeNodeKeys(timeSeriesEntry.getValue());
                LocalDate date = DateUtil.parseDate(timeSeriesEntry.getKey());
                T data = JsonParser.toObject(JsonParser.toJson(dataNodes), resultObject);
                dateObjectMap.put(date, data);
            }

        }
        return dateObjectMap;
    }

    /**
     * Parse a list of objects of a given class in a jsonNode if possible
     *
     * @param jsonNode jsonNode to be parsed
     * @param resultObject the class of the Object, i.e. T, list of T's
     * @return the list of T's parsed
     * @throws IOException if parsing failed
     */
    public static <T> List<T> getObjectList(
            JsonNode jsonNode,
            Class<T> resultObject
    ) throws IOException {
        List<T> objectList = new ArrayList<>();

        for (Iterator<Map.Entry<String, JsonNode>> it = jsonNode.fields(); it.hasNext(); ) {
            Map.Entry<String, JsonNode> nodeEntry = it.next();
            JsonNode arrNode = nodeEntry.getValue();
            if (arrNode.isArray()) {
                for (JsonNode dataNode : arrNode) {
                        T data = JsonParser.toObject(
                                JsonParser.toJson(sanitizeNodeKeys(dataNode)), resultObject);
                        objectList.add(data);
                }
            }
        }
        return objectList;
    }

    private static final String REMOVE_NUMBER_REGEX = "\\d*.\\s(.*)";
}