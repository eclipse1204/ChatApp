package com.chatApp.ChatApplication.controller;

import com.chatApp.ChatApplication.dto.*;
import com.chatApp.ChatApplication.entity.Message;
import com.chatApp.ChatApplication.entity.Room;
import com.chatApp.ChatApplication.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin
public class RoomController {

    @Autowired
    private RoomService roomService;

    //create room
    @PostMapping("/create")
    public ResponseEntity<CreateRoomResponseDto> createRoom(@RequestBody CreateRoomRequestDto createRoomRequestDto){
        return ResponseEntity.ok(roomService.createRoom(createRoomRequestDto));
    }

    //get room :join
    @PostMapping("/join/{roomId}")
    public ResponseEntity<RoomJoinResponseDto> joinRoom(@PathVariable String roomId){
        return ResponseEntity.ok(roomService.joinRoom(roomId));
    }

    @GetMapping("/fetchMessages/{id}")
    public ResponseEntity<RoomDetailsDto> getMessages(@RequestParam(name = "timestamp") Long timestamp,
                                                      @RequestParam(name = "pageSize") Integer pageSize,
                                                      @PathVariable Long id){
        return ResponseEntity.ok(roomService.getMessages(timestamp,pageSize,id));
    }

    @GetMapping("/fetchRooms")
    public ResponseEntity<PaginatedResponseDto> fetchRooms(@RequestParam(name="pageNumber") Integer pageNumber,
                                                            @RequestParam(name="pageSize") Integer pageSize,
                                                           @RequestParam(name="q",required = false) String q){
        return ResponseEntity.ok(roomService.fetchRooms(pageNumber,pageSize,q));
    }

    @PostMapping("/leave")
    public ResponseEntity<LeaveRoomResponseDto> leaveRoom(@RequestBody LeaveRoomDto leaveRoomDto){
        return ResponseEntity.ok(roomService.leaveRoom(leaveRoomDto));
    }

}
