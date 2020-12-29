package com.jonjau.portvis.alphavantage.parsing;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Regex
 */
public class RegexUtil {

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