package com.jonjau.portvis.dto;

import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UserDto {

    @Length(min = 1, max = 255, message = "Username must be between 1 to 255 characters.")
    private String username;

    @Length(min = 1, max = 255, message = "Password must be between 1 to 255 characters.")
    private String password;
}

