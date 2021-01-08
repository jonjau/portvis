package com.jonjau.portvis.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.jonjau.portvis.alphavantage.AlphaVantageClient;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 * User DTO, with javax.validation constraints and no ties to the Portfolio entity.
 */
@Data
public class UserDto {

    @Length(min = 1, max = 255, message = "Username must be between 1 to 255 characters.")
    private String username;

    // do not include password in JSON output (i.e. when serializing)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Length(min = 1, max = 255, message = "Password must be between 1 to 255 characters.")
    private String password;

    private String apiKey = AlphaVantageClient.DEFAULT_API_KEY;
}
