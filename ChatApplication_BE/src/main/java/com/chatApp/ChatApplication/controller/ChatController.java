package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.MessageRequestDto;
import com.chatApp.ChatApplication.dto.MessageResponseDto;
import com.chatApp.ChatApplication.dto.TypingDto;
import com.chatApp.ChatApplication.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;

@Controller
public class ChatController {

    @Autowired
    private ChatService chatService;

    @SendTo("/topic/room/{id}")
    @MessageMapping("/sendMessage/room/{id}")
    public MessageResponseDto sendMessage(@DestinationVariable Long id, @RequestBody MessageRequestDto messageRequestDto){
        return chatService.sendMessage(id,messageRequestDto);
    }

    @SendTo("/topic/room/{id}/typing")
    @MessageMapping("/typing/room/{id}")
    public TypingDto sendMessage(@DestinationVariable Long id, @RequestBody TypingDto typingDto){
        return typingDto;
    }

}
