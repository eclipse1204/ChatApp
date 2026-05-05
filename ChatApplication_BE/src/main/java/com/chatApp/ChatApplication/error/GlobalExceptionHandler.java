package com.chatApp.ChatApplication.error;

import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> illegalArgumentExceptionHandler(IllegalArgumentException ex){
        ApiError apiError=new ApiError(ex.getMessage(), HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(apiError,HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiError> expiredJwtExceptionHandler(ExpiredJwtException ex){
        ApiError apiError=new ApiError(ex.getMessage(),HttpStatus.UNAUTHORIZED);
        return new ResponseEntity<>(apiError,HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> exceptionHandler(Exception ex){
        ApiError apiError=new ApiError(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        return new ResponseEntity<>(apiError,HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
