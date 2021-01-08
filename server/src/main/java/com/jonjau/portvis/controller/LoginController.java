package com.jonjau.portvis.controller;

import com.jonjau.portvis.dto.JwtResponse;
import com.jonjau.portvis.dto.UserDto;
import com.jonjau.portvis.service.JwtUserDetailsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login/")
public class LoginController {

    @Value("${portvis.auth.accessTokenCookieName}")
    private String accessTokenCookieName;

    private final JwtUserDetailsService userDetailsService;

    @Autowired
    public LoginController(JwtUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostMapping
    public JwtResponse createAuthenticationToken(
            @Valid @RequestBody UserDto authenticationRequest,
            HttpServletResponse response
    ) {
        String token = userDetailsService.createAuthenticationToken(authenticationRequest);
        Cookie cookie = new Cookie(accessTokenCookieName, token);

        // FIXME: Ideally, cookies should be secure. This requires enabling HTTPS.
        //cookie.setSecure(true);

        // Delete cookie after 5 hours, to match JWT expiry.
        cookie.setMaxAge(5*60*60);

        // Prevent XSS, and make it global (accessible everywhere)
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setDomain("");
        response.addCookie(cookie);

        return new JwtResponse(token);
    }

    @GetMapping
    public Map<String, String> isAuthenticated(
            @RequestAttribute(name = "username") String username
    ) {
        // Basically a no-op: GETs to /login/ are authenticated. In the case that the user is not
        // authorized, they will get a 401, otherwise it's a 200 OK returning their username.
        // The client can check the status to see if they are logged in.
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("username", username);
        return jsonMap;
    }
}
