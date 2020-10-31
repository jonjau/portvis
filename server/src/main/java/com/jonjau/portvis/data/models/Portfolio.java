package com.jonjau.portvis.data.models;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;

@Data
// entity defaults to the name of the class
@Entity(name="portfolio")
@Table(name="PORTFOLIO")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Size(max=255, message = "Portfolio name must be between 0 and 255 characters.")
    private String name;

    @Min(value=0, message="Portfolio initial value must be between 0 and 1 billion.")
    @Max(value=1_000_000_000, message="Portfolio initial value must be between 0 and 1 billion.")
    private BigDecimal initialValue;

    @ElementCollection
    // change to Long maybe?
    // TreeMap so contents are ordered and sorted
    private Map<String, BigDecimal> allocations = new TreeMap<>();
}
