package com.jonjau.portvis.repository.entity;

import lombok.Data;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Map;
import java.util.TreeMap;

// entity defaults to the name of the class
@Data
@Entity(name = "portfolio")
@Table(name = "PORTFOLIO")
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "portfolio_id")
    private long id;

    // Portfolio is the "owning" entity, not User.
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String name;

    private BigDecimal initialValue;

    @ElementCollection
    // TreeMap so contents are ordered and sorted
    // Validations happen when DTOs are received from the client, entities such as this one
    // are assumed valid since they are created internally in the application.
    private Map<String, BigDecimal> allocations = new TreeMap<>();
}
