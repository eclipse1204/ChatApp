package com.chatApp.ChatApplication.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class LoginResponseDto {
    private String jwt;
    private Long userId;
    private String userName;
}
