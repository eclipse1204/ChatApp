package com.chatApp.ChatApplication.service;

import com.chatApp.ChatApplication.dto.MessageRequestDto;
import com.chatApp.ChatApplication.dto.MessageResponseDto;
import com.chatApp.ChatApplication.entity.Message;
import com.chatApp.ChatApplication.entity.Room;
import com.chatApp.ChatApplication.entity.User;
import com.chatApp.ChatApplication.entity.type.MessageType;
import com.chatApp.ChatApplication.repository.MessageRepository;
import com.chatApp.ChatApplication.repository.RoomRepository;
import com.chatApp.ChatApplication.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;

    @Transactional
    public MessageResponseDto sendMessage(Long id, MessageRequestDto messageRequestDto){
        User user = userRepository.findByUsername(messageRequestDto.getUserName()).orElseThrow(()->new IllegalArgumentException("User not found"));
        Room room=roomRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Room Not Found"));
        Message message=new Message();
        message.setMessage(messageRequestDto.getMessage());
        switch(messageRequestDto.getMessageType()){
            case TEXT:
                message.setMessageType(MessageType.TEXT);
                break;
            case FILE:
                message.setMessageType(MessageType.FILE);
                break;
        }
        message.setRoom(room);
        message.setSender(user);
        message.setFileUrl(messageRequestDto.getFileUrl());
        messageRepository.save(message);
        MessageResponseDto messageResponseDto=modelMapper.map(message, MessageResponseDto.class);
        messageResponseDto.setUserName(user.getUsername());
        return messageResponseDto;
    }


}
