package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.UserDto;
import com.chatApp.ChatApplication.dto.UsersPayload;
import com.chatApp.ChatApplication.service.PresenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Collections;

@Controller
@RequiredArgsConstructor
public class ChatWebSocketController {
    private final PresenceService presenceService;
    private final SimpMessagingTemplate messagingTemplate; //EventListener does not work with SendTo

    @MessageMapping("/join/{roomId}")
    @SendTo("/topic/rooms/{roomId}/users")
    public UsersPayload joinRoom(@DestinationVariable String roomId,
                         @RequestBody UserDto user,
                         SimpMessageHeaderAccessor headerAccessor) {

        String sessionId = headerAccessor.getSessionId();

        String username = user.getUsername();

        headerAccessor.getSessionAttributes().put("roomId", roomId);

        presenceService.addUser(roomId, sessionId, username);
        return new UsersPayload(presenceService.getUsers(roomId),presenceService.getUserCount(roomId));
    }

    @EventListener
    public void handleDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String sessionId = accessor.getSessionId();
        String roomId = (String) accessor.getSessionAttributes().get("roomId");
        UsersPayload payload=new UsersPayload(Collections.emptySet(),0L);
        if (roomId != null) {
            presenceService.removeUser(roomId, sessionId);
            payload=new UsersPayload(presenceService.getUsers(roomId),presenceService.getUserCount(roomId));
        }
        messagingTemplate.convertAndSend(
                "/topic/rooms/" + roomId + "/users",
                payload
        );
    }
}
