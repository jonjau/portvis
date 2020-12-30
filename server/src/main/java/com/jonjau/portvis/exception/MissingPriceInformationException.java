package com.jonjau.portvis.exception;

import java.time.Duration;
import java.time.LocalDate;

public class MissingPriceInformationException extends Exception {

    public MissingPriceInformationException(LocalDate date, Duration margin) {
        super("Could not find price information within " + margin.toDays() +
                " day(s) of " + date.toString() + ".");
    }
}
