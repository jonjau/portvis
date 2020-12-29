package com.jonjau.portvis.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateUtil {

    public static LocalDate parseDate(String dateString)
            throws DateTimeParseException {

        // this parses '2011-12-03', timezone information ignored
        return LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
    }
}