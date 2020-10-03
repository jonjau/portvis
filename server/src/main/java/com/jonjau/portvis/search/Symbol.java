package com.jonjau.portvis.search;

import lombok.Data;

@Data
public class Symbol {

    private String symbol;

    private String name;

    private String type;

    private String region;

    private String marketOpen;

    private String marketClose;

    private String timezone;

    private String currency;

    private String matchScore;
}
