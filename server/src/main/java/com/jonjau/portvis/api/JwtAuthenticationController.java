package com.jonjau.portvis.api;

import com.jonjau.portvis.data.model.JwtRequest;
import com.jonjau.portvis.data.model.JwtResponse;
import com.jonjau.portvis.data.model.UserDto;
import com.jonjau.portvis.service.JwtUserDetailsService;
import com.jonjau.portvis.utils.JwtTokenUtil;
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
//@CrossOrigin
//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JwtAuthenticationController {


    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping(value = "/login/")
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

    @GetMapping(value = "/authenticate/")
    public ResponseEntity<?> isAuthenticated(@RequestAttribute(name = "username") String username) {
        Map<String, String> jsonMap = new HashMap<>();
        jsonMap.put("username", username);
        return ResponseEntity.ok(jsonMap);
    }

    @PostMapping(value = "/register/")
    public ResponseEntity<?> saveUser(@RequestBody UserDto user) throws UserAlreadyExistsException {
        if (userDetailsService.userExists(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        return ResponseEntity.ok(userDetailsService.save(user));
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
}
