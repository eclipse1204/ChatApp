package com.chatApp.ChatApplication.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data

public class CreateRoomResponseDto {
    private String roomId;
    private String roomName;
}
