package com.chatApp.ChatApplication.dto;

import com.chatApp.ChatApplication.entity.Message;
import lombok.*;

import java.util.List;
import java.util.Set;

@Getter
@AllArgsConstructor
@Data
@Setter
@NoArgsConstructor
public class RoomDetailsDto {
    private Long id;
    private String roomName;
    private String roomId;
    private List<MessageResponseDto> messages;
    private Long countUsers;
}
