package com.jonjau.portvis.data.models;

import lombok.Data;

import javax.persistence.*;
import java.util.HashMap;
import java.util.Map;

@Data
// defaults to the name of the class
@Entity(name="portfolio")
@Table(name="PORTFOLIO")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ElementCollection
    // change to Long maybe?
    private Map<String, Integer> allocations = new HashMap<>();
}
