package com.example.demo.Exceptions;

import com.example.demo.DataType.BaseResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandle {
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<BaseResponse> tokenInvalid(CustomException e){
        BaseResponse baseResponse = BaseResponse.builder()
                .httpStatus(e.getHttpStatus().value())
                .msg(e.getMessage())
                .build();
        return ResponseEntity.status(e.getHttpStatus()).body(baseResponse);
    }
}
