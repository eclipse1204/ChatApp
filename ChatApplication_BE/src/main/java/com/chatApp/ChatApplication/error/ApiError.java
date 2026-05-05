package com.chatApp.ChatApplication.error;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiError {
    private Long timestamp;
    private String message;
    private HttpStatus httpStatus;

    ApiError(String message,HttpStatus httpStatus){
        this.timestamp=System.currentTimeMillis();
        this.message=message;
        this.httpStatus=httpStatus;
    }
}
