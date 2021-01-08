package com.jonjau.portvis.util;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateUtil {

    /**
     * Parses a date string into a LocalDate
     * @param dateString the string to be parsed, e.g. '2011-12-03'
     * @return the parsed LocalDate
     * @throws DateTimeParseException if parsing fails
     */
    public static LocalDate parseDate(String dateString)
            throws DateTimeParseException {

        // this parses '2011-12-03', timezone information ignored
        return LocalDate.parse(dateString, DateTimeFormatter.ISO_LOCAL_DATE);
    }
}