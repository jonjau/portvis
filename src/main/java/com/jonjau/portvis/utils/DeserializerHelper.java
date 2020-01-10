package com.jonjau.portvis.utils;

import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;
import com.jonjau.portvis.timeseries.MetaData;

/**
 * DeserializerHelper
 */
public class DeserializerHelper {

    public static Map<String, Object> sanitizeNodeKeys(JsonNode jsonNode) {
        Map<String, Object> sanitizedNodes = new HashMap<>();
        jsonNode.fields().forEachRemaining((node) -> {
            String regexMatch = Regex.getMatch(REMOVE_NUMBER_REGEX,
                    node.getKey());
            // remove numbers from JSON property names (if any)
            if (regexMatch != null) {
                sanitizedNodes.put(regexMatch, node.getValue());
            }
            else {
                sanitizedNodes.put(node.getKey(), node.getValue());
            }
        });
        return sanitizedNodes;
        
    }

    public static MetaData getMetaData(JsonNode jsonNode) {
        Map<String, Object> sanitizedNodes = sanitizeNodeKeys(jsonNode)
    }

    private static final String REMOVE_NUMBER_REGEX = "\\d*.\\s(.*)";

    private static final SimpleDateFormat DATE_TIME_PARSER = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm:SS");
}