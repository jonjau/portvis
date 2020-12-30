package com.jonjau.portvis.repository.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;

@Data
// entity defaults to the name of the class
@Entity(name="portfolio")
@Table(name="PORTFOLIO")
public class Portfolio {
    @Id
    @Column(name = "portfolio_id")
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    // Portfolio is the "owning" entity, not User.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;

    private BigDecimal initialValue;

    @ElementCollection
    // TreeMap so contents are ordered and sorted
    private Map<String, BigDecimal> allocations = new TreeMap<>();
}
