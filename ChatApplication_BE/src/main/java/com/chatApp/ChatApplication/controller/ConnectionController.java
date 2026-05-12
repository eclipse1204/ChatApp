package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.ConnectionResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/connection")
@CrossOrigin
public class ConnectionController {

    @GetMapping
    public ResponseEntity<ConnectionResponseDto> connectionEstablish(){
        ConnectionResponseDto connectionResponseDto=new ConnectionResponseDto("Success");
        return ResponseEntity.ok(connectionResponseDto);
    }
}
