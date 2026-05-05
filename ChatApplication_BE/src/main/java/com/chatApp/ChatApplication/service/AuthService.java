package com.chatApp.ChatApplication.service;

import com.chatApp.ChatApplication.dto.LoginRequestDto;
import com.chatApp.ChatApplication.dto.LoginResponseDto;
import com.chatApp.ChatApplication.dto.SignupResponseDto;
import com.chatApp.ChatApplication.entity.User;
import com.chatApp.ChatApplication.repository.UserRepository;
import com.chatApp.ChatApplication.security.AuthUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final AuthUtil authUtil;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    public LoginResponseDto login(LoginRequestDto loginRequestDto){
        Authentication authentication= authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(),loginRequestDto.getPassword())
        );
        User user= (User) authentication.getPrincipal();
        String token=authUtil.generateAccessToken(user);
        return new LoginResponseDto(token, user.getId(), user.getUsername());
    }

    public SignupResponseDto signup(LoginRequestDto signupRequestDto){
        User exisitingUser=userRepository.findByUsername(signupRequestDto.getUsername()).orElse(null);
        if(exisitingUser!=null){
            throw new IllegalArgumentException("User already exists");
        }
        User newUser=new User();
        newUser.setUsername(signupRequestDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(signupRequestDto.getPassword()));
        userRepository.save(newUser);
        return modelMapper.map(newUser,SignupResponseDto.class);
    }
}
