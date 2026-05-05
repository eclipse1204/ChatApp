package com.chatApp.ChatApplication.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RoomJoinResponseDto {
    private String username;
    private String roomId;
}
