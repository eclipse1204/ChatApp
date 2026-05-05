package com.chatApp.ChatApplication.dto;

import com.chatApp.ChatApplication.entity.type.MessageType;
import lombok.*;

@Data
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MessageRequestDto {
    private String message;
    private String fileUrl;
    private MessageType messageType;
    private String userName;
}
