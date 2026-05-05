package com.chatApp.ChatApplication.dto;

import lombok.*;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UsersPayload {
    private Set<String> users;
    private Long count;
}
