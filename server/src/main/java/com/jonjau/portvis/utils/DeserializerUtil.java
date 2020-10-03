package com.jonjau.portvis.utils;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;

import com.fasterxml.jackson.databind.JsonNode;

import static com.jonjau.portvis.timeseries.MetaData.META_DATA_RESPONSE_KEY;
import static com.jonjau.portvis.timeseries.MetaData.TIMEZONE_KEY;

import com.jonjau.portvis.search.SymbolSearchResult;
import com.jonjau.portvis.timeseries.MetaData;

/**
 * DeserializerHelper
 * Utility Class
 */
public final class DeserializerUtil {

    /**
     * @param jsonNode
     * @return TODO: JAVADOCS
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

    public static <T> Map<LocalDate, T> getDateObjectMap(JsonNode jsonNode, Class<T> resultObject) {

        // TreeMap ensures sorted order
        Map<LocalDate, T> dateObjectMap = new TreeMap<>();
        // assume metadata always exists
        //String timezone = jsonNode.get(META_DATA_RESPONSE_KEY).get(TIMEZONE_KEY).textValue();

        jsonNode.fields().forEachRemaining(nodeEntry -> {
            // ignore metadata, only want time series data
            if (nodeEntry.getKey().equals(META_DATA_RESPONSE_KEY)) {
                return;
            }
            nodeEntry.getValue().fields().forEachRemaining(timeSeriesEntry -> {
                // dataNodes: high, low, open, volume, etc.
                Map<String, Object> dataNodes = sanitizeNodeKeys(timeSeriesEntry.getValue());
                try {
                    LocalDate date = parseDate(timeSeriesEntry.getKey());
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
                        } catch (IOException | DateTimeParseException e) {
                            e.printStackTrace();
                        }
                    }
                }
        });
        return objectList;
    }



    public static LocalDate parseDate(String dateString)
            throws DateTimeParseException {

        // this parses '2011-12-03'
        return LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);

        // interpret this as time in the given zone string e.g. US/Eastern
        //return ldt.atZone(ZoneId.of(zone));
    }

//    public static Date parseDate(String dateString)
//            throws ParseException {
//        // expect either date string or date-time string
//        Date date = DATE_PARSER.parse(dateString);
//        if (dateString.length() > DATE_FORMAT.length()) {
//            date = DATE_TIME_PARSER.parse(dateString);
//        }
//        return date;
//    }

    private static final String REMOVE_NUMBER_REGEX = "\\d*.\\s(.*)";

    private static final String DATE_TIME_FORMAT = "yyyy-MM-dd HH:mm:SS";
    private static final String DATE_FORMAT = "yyyy-MM-dd";

    private static final SimpleDateFormat DATE_TIME_PARSER = new SimpleDateFormat(DATE_TIME_FORMAT);
    private static final SimpleDateFormat DATE_PARSER = new SimpleDateFormat(DATE_FORMAT);
}