package com.chatApp.ChatApplication.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TypingDto {
    private Boolean typing;
    private String userName;
}
