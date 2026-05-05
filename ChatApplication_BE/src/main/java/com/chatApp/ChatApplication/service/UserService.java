package com.chatApp.ChatApplication.service;

import com.chatApp.ChatApplication.dto.UsersResponseDto;
import com.chatApp.ChatApplication.entity.User;
import com.chatApp.ChatApplication.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UsersResponseDto fetchUsers(String q,Integer pageSize){
        List<String> users=userRepository.findByUsernameStartsWith(q, PageRequest.of(0,pageSize))
                .stream()
                .map(user->user.getUsername())
                .toList();
        return new UsersResponseDto(users);
    }
}
