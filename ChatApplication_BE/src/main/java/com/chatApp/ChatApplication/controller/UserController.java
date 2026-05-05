package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.UsersResponseDto;
import com.chatApp.ChatApplication.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/fetch")
    public ResponseEntity<UsersResponseDto> fetchUsers(@RequestParam(name = "q") String q,
                                                       @RequestParam(name = "pageSize") Integer pageSize){
        return ResponseEntity.ok(userService.fetchUsers(q,pageSize));
    }


}
