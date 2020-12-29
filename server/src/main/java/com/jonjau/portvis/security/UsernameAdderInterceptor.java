package com.jonjau.portvis.security;

import com.jonjau.portvis.repository.UserRepository;
import com.jonjau.portvis.util.JwtTokenUtil;
import io.jsonwebtoken.ExpiredJwtException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class UsernameAdderInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserRepository userRepository;

    // the name of the cookie that stores the JWT token in the client
    @Value("${portvis.auth.accessTokenCookieName}")
    private String accessTokenCookieName;

    private static final Logger logger = LoggerFactory.getLogger(UsernameAdderInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response, Object handler) {

        // Get the JWT from the Cookie then get the username from that JWT
        // then add it as a request attribute so each handler knows who the current user is.
        String jwtToken = jwtTokenUtil.getJwtFromCookie(request);
        if (jwtToken != null) {
            try {
                String username = jwtTokenUtil.getUsernameFromToken(jwtToken);
                request.setAttribute("username", username);

            } catch (IllegalArgumentException e) {
                System.out.println("Illegal JWT Token");
            } catch (ExpiredJwtException e) {
                System.out.println("JWT Token has expired");
            }
        } else {
            logger.warn("Unable to get JWT Token");
        }
        // return true means we let Spring take this (modified) request to the appropriate handler
        // if returned false, we need to make sure 'response' is sent
        return true;
    }
    // can override PostHandle and afterCompletion as well
}
