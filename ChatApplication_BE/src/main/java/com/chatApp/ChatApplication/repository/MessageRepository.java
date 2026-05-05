package com.chatApp.ChatApplication.repository;

import com.chatApp.ChatApplication.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {
//    @Query("SELECT M FROM Message M WHERE M.room.id=:id ORDER BY M.timestamp DESC")
    Page<Message> findByRoom_IdOrderByTimestampDesc(Long id,Pageable pageable);

    Page<Message> findByRoom_IdAndTimestampLessThanOrderByTimestampDesc(Long id, Long timestamp,Pageable pageable);


}
