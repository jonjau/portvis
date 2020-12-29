package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.UserDto;
import com.jonjau.portvis.exception.UserAlreadyExistsException;
import com.jonjau.portvis.service.JwtUserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/register/")
//@CrossOrigin
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class RegisterController {

    private final JwtUserDetailsService userDetailsService;
    public RegisterController(JwtUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    public ResponseEntity<?> saveUser(@RequestBody UserDto user) throws UserAlreadyExistsException {
        if (userDetailsService.userExists(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        return ResponseEntity.ok(userDetailsService.save(user));
    }
}
