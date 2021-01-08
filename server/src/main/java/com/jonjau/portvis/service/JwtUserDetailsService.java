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

/**
 * Service responsible for user lookup, login, registration, and authentication.
 */
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

    // As above
    @Autowired
    public void setAuthenticationManager(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Returns a JWT token for a given user.
     */
    public String createAuthenticationToken(UserDto authenticationRequest) {
        authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
        final UserDetails userDetails = loadUserByUsername(
                authenticationRequest.getUsername());
        return jwtTokenComponent.generateToken(userDetails);
    }

    /**
     * Checks if the user (username/password pair) is authenticated, throwing an exception if the
     * check fails.
     */
    private void authenticate(String username, String password) throws AuthenticationException {
        // e.g. may throw BadCredentialsException (mostly this?), etc.
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                username, password
        ));
    }

    /**
     * Finds a user with the given username and returning their details.
     *
     * @param username the username of the user to be searched for
     * @return the user's details
     * @throws UsernameNotFoundException if the user is not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserDto userDto = getUser(username);
        return new org.springframework.security.core.userdetails.User(
                userDto.getUsername(),
                userDto.getPassword(),
                new ArrayList<>()
        );
    }

    /**
     * Finds a User with the given username in the repository and return it as a UserDto.
     *
     * @param username the username of the user to be searched for
     * @return the User as a UserDto
     * @throws UsernameNotFoundException if the user is not found
     */
    public UserDto getUser(String username) throws UsernameNotFoundException {
        return toDto(findUser(username));
    }

    /**
     * Update a user's details. NOTE: the user's username must not have been changed.
     * @param updatedUserDto the UserDto to override the current User stored (with the same
     *                       username)
     * @return the updated user as a UserDto
     * @throws UsernameNotFoundException if the user is not found
     */
    public UserDto updateUser(UserDto updatedUserDto) throws UsernameNotFoundException {
        String username = updatedUserDto.getUsername();
        User user = findUser(username);

        user.setApiKey(updatedUserDto.getApiKey());

        User updatedUser = userRepository.save(user);

        return toDto(updatedUser);
    }

    /**
     * Returns whether the user with the given username exists in the repository.
     * @param username the username of the user to be searched for
     */
    public boolean userExists(String username) {
        User user = userRepository.findByUsername(username);
        return user != null;
    }

    /**
     * Registers a user: adds them to the repository, with their passwords encrypted.
     *
     * @param user the user to be registered
     * @return the registered user
     * @throws UsernameNotFoundException if the user is not found
     */
    public UserDto registerUser(UserDto user) throws UserAlreadyExistsException {
        if (userExists(user.getUsername())) {
            throw new UserAlreadyExistsException(user.getUsername());
        }
        User newUser = new User();
        newUser.setUsername(user.getUsername());
        newUser.setPassword(passwordEncoder.encode(user.getPassword()));
        newUser.setApiKey(user.getApiKey());

        return toDto(userRepository.save(newUser));
    }

    private User findUser(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User with username '" + username + "' not found.");
        }
        return user;
    }

    private User toEntity(UserDto userDto) {
        return modelMapperComponent.map(userDto, User.class);
    }

    private UserDto toDto(User user) {
        return modelMapperComponent.map(user, UserDto.class);
    }
}
