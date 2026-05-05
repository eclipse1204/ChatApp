package com.chatApp.ChatApplication.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    private String roomId;

    @OneToMany(mappedBy = "room",cascade = CascadeType.REMOVE)
    private List<Message> messages=new ArrayList<>();

    @ManyToMany
    private List<User> users=new ArrayList<>();
}
