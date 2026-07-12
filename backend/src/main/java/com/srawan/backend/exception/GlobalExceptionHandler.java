package com.srawan.backend.exception;

import java.util.Map;

import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.access.AccessDeniedException;

import java.util.HashMap;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;


@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String,Object>> handleDuplicateResource(DuplicateResourceException ex){
        Map<String, Object>response = Map.of(
            "timestamp", LocalDateTime.now().toString(),
            "status", 409,
            "error", "Conflict",
            "message", ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    

            }
        
        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex){
            Map<String, Object>response = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", 404,
                "error", "Not Found",
                "message", ex.getMessage()
            );

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }


        @ExceptionHandler(UnauthorizedActionException.class)
public ResponseEntity<Map<String,Object>> handleUnauthorized(
        UnauthorizedActionException ex
){

    Map<String,Object> response = Map.of(

        "timestamp", LocalDateTime.now().toString(),

        "status", 403,

        "error", "Forbidden",

        "message", ex.getMessage()

    );


    return ResponseEntity
            .status(HttpStatus.FORBIDDEN)
            .body(response);

}

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<Map<String,Object>> handleAccessDenied(
                AccessDeniedException ex
        ){
            Map<String,Object> response = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", 403,
                "error", "Forbidden",
                "message", "You are not allowed to perform this action"
            );

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(response);
        }

        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<Map<String,Object>> handleInvalidCredentials(
                InvalidCredentialsException ex
        ){
            Map<String,Object> response = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "status", 401,
                "error", "Unauthorized",
                "message", ex.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(response);
        }







@ExceptionHandler(Exception.class)
public ResponseEntity<Map<String,Object>> handleGeneralException(
        Exception ex
){

    Map<String,Object> response = Map.of(

        "timestamp", LocalDateTime.now().toString(),

        "status", 500,

        "error", "Internal Server Error",

        "message", ex.getMessage()

    );


    return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(response);

}

@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<Map<String,Object>> handleValidationErrors(
        MethodArgumentNotValidException ex
){


    Map<String,String> errors =
            new HashMap<>();



    ex.getBindingResult()
            .getFieldErrors()
            .forEach(

                error -> errors.put(

                    error.getField(),

                    error.getDefaultMessage()

                )

            );




    Map<String,Object> response =
            Map.of(

                "timestamp",
                LocalDateTime.now().toString(),

                "status",
                400,

                "error",
                "Validation Failed",

                "messages",
                errors

            );





    return ResponseEntity

            .status(HttpStatus.BAD_REQUEST)

            .body(response);


}
    }
