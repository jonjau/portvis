package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.JwtRequest;
import com.jonjau.portvis.dto.JwtResponse;
import com.jonjau.portvis.service.JwtUserDetailsService;
import com.jonjau.portvis.util.JwtTokenUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login/")
public class LoginController {

    private final AuthenticationManager authenticationManager;
    private final JwtUserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;

    @Autowired
    public LoginController(
            AuthenticationManager authenticationManager,
            JwtUserDetailsService userDetailsService,
            JwtTokenUtil jwtTokenUtil
    ) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    private void authenticate(String username, String password) throws Exception {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    username, password
            ));
        } catch (DisabledException e) {
            throw new Exception("USER_DISABLED");
        } catch (BadCredentialsException e) {
            throw new Exception("INVALID_CREDENTIALS");
        }
    }

    @PostMapping
    public ResponseEntity<?> createAuthenticationToken(
            @RequestBody JwtRequest authenticationRequest,
            HttpServletResponse response
    ) throws Exception {

        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = userDetailsService.loadUserByUsername(
                authenticationRequest.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);

        Cookie cookie = new Cookie("accessToken", token);
        // FIXME: cookie.setSecure(true);
        // Delete cookie after 5 hours, to match JWT expiry.
        // Prevent XSS, and make it global (accessible everywhere)
//        cookie.setMaxAge(5*60*60);
        cookie.setMaxAge(2*60);
        cookie.setHttpOnly(false);
        cookie.setPath("/");
        cookie.setDomain("");
        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(token));
    }

    @GetMapping
    public ResponseEntity<?> isAuthenticated(@RequestAttribute(name = "username") String username) {
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("username", username);
        return ResponseEntity.ok(jsonMap);
    }
}
