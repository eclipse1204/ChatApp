package com.chatApp.ChatApplication.repository;

import com.chatApp.ChatApplication.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByUsername(String username);
    Long countByRooms_Id(Long id);
    Page<User> findByUsernameStartsWith(String q, Pageable pageable);
}
