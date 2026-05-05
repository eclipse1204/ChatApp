package com.chatApp.ChatApplication.service;

import com.chatApp.ChatApplication.dto.*;
import com.chatApp.ChatApplication.entity.Message;
import com.chatApp.ChatApplication.entity.Room;
import com.chatApp.ChatApplication.entity.User;
import com.chatApp.ChatApplication.repository.MessageRepository;
import com.chatApp.ChatApplication.repository.RoomRepository;
import com.chatApp.ChatApplication.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.jspecify.annotations.Nullable;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public CreateRoomResponseDto createRoom(CreateRoomRequestDto createRoomRequestDto){
        String roomId = UUID.randomUUID().toString();
        Room room=new Room();
        room.setRoomId(roomId);
        room.setRoomName(createRoomRequestDto.getRoomName());
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user==null){
            throw new IllegalArgumentException("User not found");
        }
        room.getUsers().add(user);
        roomRepository.save(room);
        return modelMapper.map(room,CreateRoomResponseDto.class);
    }

    @Transactional
    public RoomJoinResponseDto joinRoom(String id) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user==null){
            throw new IllegalArgumentException("User not found");
        }
        Room room=roomRepository.findByRoomId(id).orElseThrow(()->new IllegalArgumentException("Room not found"));
        room.getUsers().stream().forEach((user1)->{
            if(user1.getId().equals(user.getId())){
                throw new IllegalArgumentException("User is already added");
            }
        });
        room.getUsers().add(user);
        roomRepository.save(room);
        return new RoomJoinResponseDto(user.getUsername(),room.getRoomId());
    }

    @Transactional
    public RoomDetailsDto getMessages(Long timestamp,Integer pageSize,Long id){
        Room room=roomRepository.findById(id).orElseThrow(()->new IllegalArgumentException("Room not found"));
        List<MessageResponseDto> messages=messageRepository.findByRoom_IdAndTimestampLessThanOrderByTimestampDesc(id,timestamp,PageRequest.of(0,pageSize))
                .stream()
                .map((message -> {
                    MessageResponseDto messageResponseDto=modelMapper.map(message, MessageResponseDto.class);
                    messageResponseDto.setUserName(message.getSender().getUsername());
                    return messageResponseDto;
                }))
                .toList();
        Long countUsers=userRepository.countByRooms_Id(id);
        return new RoomDetailsDto(room.getId(), room.getRoomName(), room.getRoomId(), messages, countUsers);
    }

    @Transactional
    public PaginatedResponseDto fetchRooms(Integer pageNumber,Integer pageSize,String q) {
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(user==null){
            throw new IllegalArgumentException("User not found");
        }
        Page<Room> page;
        if(q!=null){
            page=roomRepository.findByUsers_IdAndRoomNameStartingWith(user.getId(),q,PageRequest.of(pageNumber,pageSize));
        }
        else{
            page=roomRepository.findByUsers_Id(user.getId(),PageRequest.of(pageNumber,pageSize));
        }
        List<RoomResponseDto> rooms=page.stream().map((room)->modelMapper.map(room,RoomResponseDto.class)).toList();
        PaginatedResponseDto paginatedResponseDto=new PaginatedResponseDto(rooms,page.getTotalElements(), (long) page.getTotalPages());
        return paginatedResponseDto;
    }

    @Transactional
    public LeaveRoomResponseDto leaveRoom(LeaveRoomDto leaveRoomDto) {
        User user= (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Room roomFound=roomRepository.findByIdAndUsers_Id(leaveRoomDto.getId(),user.getId()).orElseThrow(()->new IllegalArgumentException("Room with this user not found"));
        if(roomFound!=null){
            roomFound.getUsers().removeIf((user1)->user1.getId().equals(user.getId()));
            roomRepository.save(roomFound);
        }
        LeaveRoomResponseDto leaveRoomResponseDto=new LeaveRoomResponseDto();
        leaveRoomResponseDto.setSuccess(true);
        return leaveRoomResponseDto;
    }
}
