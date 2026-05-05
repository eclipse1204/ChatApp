package com.chatApp.ChatApplication.dto;

import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDto {
    private Long id;
    private String roomId;
    private String roomName;
}
