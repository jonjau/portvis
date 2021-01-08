package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.UserDto;
import com.jonjau.portvis.exception.UserAlreadyExistsException;
import com.jonjau.portvis.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/register/")
//@CrossOrigin
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RegisterController {

    private final JwtUserDetailsService userDetailsService;

    @Autowired
    public RegisterController(JwtUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    public UserDto registerUser(
            @Valid @RequestBody UserDto user
    ) throws UserAlreadyExistsException {
        // the password returned will be encrypted.
        return userDetailsService.registerUser(user);
    }
}
