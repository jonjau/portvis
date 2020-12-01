package com.jonjau.portvis.api;

public class UserAlreadyExistsException extends Exception {
    public UserAlreadyExistsException(String username) {
        super("User with that username already exists: " + username);
    }
}
