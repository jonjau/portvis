package com.jonjau.portvis.utils;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 * JsonParser
 */
public class JsonParser {

    public static <T> T toObject(String json, Class<T> object)
            throws IOException {
        return JSON_PARSER.readValue(json, object);
    }

    public static String toJson(Object object) 
            throws JsonProcessingException {
        return JSON_PARSER.writeValueAsString(object);
    }

    public static <T> void addDeserializer(Class<T> deserializationClass,
            JsonDeserializer<T> deserializer) {
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addDeserializer(deserializationClass, deserializer);
        JSON_PARSER.registerModule(simpleModule);
    }

    private static final ObjectMapper JSON_PARSER = new ObjectMapper();
}