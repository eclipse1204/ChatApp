package com.chatApp.ChatApplication.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class SignupResponseDto {
    private Long userId;
    private String username;
}
