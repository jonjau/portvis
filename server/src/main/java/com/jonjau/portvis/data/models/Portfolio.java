package com.jonjau.portvis.data.models;

import lombok.Data;

import javax.persistence.*;
import java.util.Map;
import java.util.TreeMap;

@Data
// defaults to the name of the class
@Entity(name="portfolio")
@Table(name="PORTFOLIO")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private double initialValue;

    @ElementCollection
    // change to Long maybe?
    // TreeMap so contents are ordered and sorted
    private Map<String, Double> allocations = new TreeMap<>();
}
