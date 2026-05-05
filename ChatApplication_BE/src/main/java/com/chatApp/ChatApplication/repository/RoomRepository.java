package com.chatApp.ChatApplication.repository;

import com.chatApp.ChatApplication.entity.Room;
import com.chatApp.ChatApplication.entity.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room,Long> {
    Optional<Room> findByRoomId(String roomId);

    Optional<Room> findByIdAndUsers_Id(Long id,Long userId);

    Page<Room> findByUsers_Id(Long id,Pageable pageable);

    Page<Room> findByUsers_IdAndRoomNameStartingWith(Long id,String q,Pageable pageable);
}
