package com.jonjau.portvis.service;

import com.jonjau.portvis.exception.UserAlreadyExistsException;
import com.jonjau.portvis.repository.UserRepository;
import com.jonjau.portvis.repository.entity.User;
import com.jonjau.portvis.dto.UserDto;
import com.jonjau.portvis.util.JwtTokenComponent;
import com.jonjau.portvis.util.ModelMapperComponent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class JwtUserDetailsService implements UserDetailsService {

    private final ModelMapperComponent modelMapperComponent;
    private final UserRepository userRepository;
    private final JwtTokenComponent jwtTokenComponent;

    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public JwtUserDetailsService(
            UserRepository userRepository,
            ModelMapperComponent modelMapperComponent,
            JwtTokenComponent jwtTokenComponent
    ) {
        this.userRepository = userRepository;
        this.modelMapperComponent = modelMapperComponent;
        this.jwtTokenComponent = jwtTokenComponent;
    }

    // setter injection to avoid circular dependencies (a redesign of the hierarchy would have
    // been preferred). The issue is with the PasswordEncoder and AuthenticationManager.
    @Autowired
    public void setPasswordEncoder(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public String createAuthenticationToken(UserDto authenticationRequest) {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = loadUserByUsername(
                authenticationRequest.getUsername());
        return jwtTokenComponent.generateToken(userDetails);
    }

    private void authenticate(String username, String password) throws AuthenticationException {
        // e.g. may throw BadCredentialsException (mostly this?), etc.
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                username, password
        ));
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User with username '" + username + "' not found.");
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    public boolean userExists(String username) {
        User user = userRepository.findByUsername(username);
        return user != null;
    }

    public UserDto registerUser(UserDto user) throws UserAlreadyExistsException {
        if (userExists(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));

        return toDto(userRepository.save(newUser));
    }

    private UserDto toDto(User user) {
        return modelMapperComponent.map(user, UserDto.class);
    }
}
