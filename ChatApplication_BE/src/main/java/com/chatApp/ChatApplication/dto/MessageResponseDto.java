package com.chatApp.ChatApplication.dto;

import com.chatApp.ChatApplication.entity.type.MessageType;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDto {
    private String message;
    private String fileUrl;
    private MessageType messageType;
    private Long timestamp;
    private String userName;
}
