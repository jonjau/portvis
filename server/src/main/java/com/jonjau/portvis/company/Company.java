package com.jonjau.portvis.company;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// ignore attributes/properties that have not been defined in this class
@JsonIgnoreProperties(ignoreUnknown = true)
@Data
public class Company {

    @JsonProperty("Symbol")
    private String symbol;

    @JsonProperty("AssetType")
    private String assetType;

    @JsonProperty("Name")
    private String name;

    @JsonProperty("Description")
    private String description;

    @JsonProperty("Sector")
    private String sector;

    @JsonProperty("Industry")
    private String industry;
}
