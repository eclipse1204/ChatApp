package com.chatApp.ChatApplication.entity;

import com.chatApp.ChatApplication.entity.type.MessageType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Table(indexes = {
        @Index(name = "idx_room_timestamp", columnList = "room_id, timestamp")
})
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn
    private User sender;
    private String message;
    private Long timestamp;
    private String fileUrl;

    @Enumerated(EnumType.STRING)
    private MessageType messageType;

    @ManyToOne
    @JoinColumn
    private Room room;

    @PrePersist
    private void create(){
        this.timestamp=System.currentTimeMillis();
    }
}
