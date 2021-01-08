package com.jonjau.portvis.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Template for an API error response sent by this server program.
 */
@Data
@RequiredArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public final class ApiErrorResponse {

    private final HttpStatus status;
    private final LocalDateTime timestamp;
    private final String title;
    private final String message;
    private List<String> subErrorMessages;

    public static <T extends Exception> ApiErrorResponse create(
            HttpStatus status,
            String title,
            T exception) {
        return new ApiErrorResponse(status, LocalDateTime.now(), title, exception.getMessage());
    }

    public static ApiErrorResponse create(
            HttpStatus status,
            String title,
            String message,
            List<String> subErrorMessages
    ) {
        return new ApiErrorResponse(status, LocalDateTime.now(), title, message, subErrorMessages);
    }
}
