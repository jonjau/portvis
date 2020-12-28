package com.jonjau.portvis.data.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "user")
@Table(name = "USER")
public class User {
    //TODO: IDENTITY or AUTO?
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private long id;

    @OneToMany(mappedBy = "user")
    private Set<Portfolio> portfolios;

    // TODO: have length constraints here too, as in the frontend
    @Column(unique = true)
    private String username;

    @JsonIgnore
    private String password;

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}
