package com.example.demo.Exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.http.HttpStatus;
public class CustomException extends RuntimeException{
    private final HttpStatus httpStatus;
    public CustomException(String msg, HttpStatus httpStatus) {
        super(msg);
        this.httpStatus=httpStatus;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
