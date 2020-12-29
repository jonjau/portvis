package com.jonjau.portvis.exception;

public class UserAlreadyExistsException extends Exception {
    public UserAlreadyExistsException(String username) {
        super("User with that username already exists: " + username);
    }
}
