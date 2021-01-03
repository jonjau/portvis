package com.jonjau.portvis.alphavantage.parsing;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Utility class containing static methods that deal with regular expressions
 */
public class RegexUtil {

    /**
     * @param regex the regex to match, assumed to have at least one capture group
     * @param toMatch string to match on
     * @return the captured text if any, else null
     */
    public static String getMatch(String regex, String toMatch) {
        final Pattern pattern = Pattern.compile(regex);
        final Matcher matcher = pattern.matcher(toMatch);

        String match = null;
        if (matcher.matches()) {
            // return first capture group
            match = matcher.group(1);
        }
        return match;
    }
}
