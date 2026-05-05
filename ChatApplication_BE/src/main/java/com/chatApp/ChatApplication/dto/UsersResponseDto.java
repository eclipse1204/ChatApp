package com.chatApp.ChatApplication.dto;

import com.chatApp.ChatApplication.entity.User;
import lombok.*;

import java.util.List;

@Data
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UsersResponseDto {
    private List<String> users;
}
