package com.jonjau.portvis.repository.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.Set;

@Data
@Entity(name = "user")
@Table(name = "USER")
public class User {
    // Identity means "autoincrement"
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @OneToMany(mappedBy = "user")
    private Set<Portfolio> portfolios;

    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;
}
