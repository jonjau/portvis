package com.jonjau.portvis.exception;

import com.jonjau.portvis.dto.ApiErrorResponse;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalCustomExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({PortfolioNotFoundException.class})
    public ResponseEntity<ApiErrorResponse> handle(PortfolioNotFoundException exception) {
        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.NOT_FOUND,
                "Portfolio not found",
                exception);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler({UserAlreadyExistsException.class})
    public ResponseEntity<ApiErrorResponse> handle(UserAlreadyExistsException exception) {
        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.CONFLICT,
                "Duplicate username",
                exception);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler({BadCredentialsException.class})
    public ResponseEntity<ApiErrorResponse> handle(BadCredentialsException exception) {
        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Incorrect username or password",
                exception);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

    @ExceptionHandler({MissingPriceInformationException.class})
    public ResponseEntity<ApiErrorResponse> handle(MissingPriceInformationException exception) {
        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.UNPROCESSABLE_ENTITY,
                "Missing price information",
                exception);
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(response);
    }

    @ExceptionHandler({CompanyNotFoundException.class})
    public ResponseEntity<ApiErrorResponse> handle(CompanyNotFoundException exception) {
        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.NOT_FOUND,
                "Company not found",
                exception);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // This one is meant to handle javax.validation constraint errors on the DTOs.
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request
    ) {

        // Get the names of the fields with errors
        List<String> errantFields = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(FieldError::getField)
                .collect(Collectors.toList());

        // Get the error messages of the fields with errors
        List<String> errorMessages = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        ApiErrorResponse response = ApiErrorResponse.create(
                HttpStatus.BAD_REQUEST,
                "Invalid method argument",
                "Could not validate fields " + errantFields.toString() +
                        " in method argument '" + ex.getParameter().getParameterName() + "'.",
                errorMessages);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
