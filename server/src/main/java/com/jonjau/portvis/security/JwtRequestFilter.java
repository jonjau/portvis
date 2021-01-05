package com.jonjau.portvis.security;

import com.jonjau.portvis.service.JwtUserDetailsService;
import com.jonjau.portvis.util.JwtTokenComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenComponent jwtTokenComponent;
    private JwtUserDetailsService jwtUserDetailsService;

    @Autowired
    public JwtRequestFilter(JwtTokenComponent jwtTokenComponent) {
        this.jwtTokenComponent = jwtTokenComponent;
    }

    // Setter injection to avoid circular dependencies
    @Autowired
    public void setJwtUserDetailsService(JwtUserDetailsService jwtUserDetailsService) {
        this.jwtUserDetailsService = jwtUserDetailsService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        // In the case that you have a HandlerInterceptor, this filter gets run before that
        // interceptor, and only after that does the request go to the controllers

        // Get the JWT from the Cookie then get the username from that JWT then add it as a
        // request attribute so each handler knows who the current user is. There are probably
        // better approaches than this.
        String username = null;
        String jwtToken = jwtTokenComponent.getJwtFromCookie(request);
        if (jwtToken != null) {
            // Assuming the cookie containing the JWT has not yet expired in the request,
            // this code examining the JWT might throw IllegalArgumentException if JWT is
            // illegal or ExpiredJwtException if the JWT (separate from the cookie) has expired
            username = jwtTokenComponent.getUsernameFromToken(jwtToken);
            String apiKey= jwtUserDetailsService.getUser(username).getApiKey();
            request.setAttribute("username", username);
            request.setAttribute("apiKey", apiKey);
        }

        // Once we get the token validate it.
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            UserDetails userDetails = this.jwtUserDetailsService.loadUserByUsername(username);

            // if token is valid configure Spring Security to manually set authentication
            if (jwtTokenComponent.validateToken(jwtToken, userDetails)) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the Spring Security
                // Configurations successfully.
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        chain.doFilter(request, response);
    }


}
