package com.jonjau.portvis.dto;

import lombok.Data;

/**
 * A server response containing the JWT token for authentication
 */
@Data
public class JwtResponse {
    private final String jwtToken;
}
