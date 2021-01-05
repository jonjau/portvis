package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.UserDto;
import com.jonjau.portvis.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    private final JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    public AccountController(JwtUserDetailsService jwtUserDetailsService) {
        this.jwtUserDetailsService = jwtUserDetailsService;
    }

    @GetMapping
    public UserDto getAccountDetails(
            @RequestAttribute String username
    ) {
        return jwtUserDetailsService.getUser(username);
    }

    @PutMapping
    public UserDto updateAccountDetails(
            @Valid @RequestBody UserDto userDto
    ) {
        return jwtUserDetailsService.updateUser(userDto);
    }
}
