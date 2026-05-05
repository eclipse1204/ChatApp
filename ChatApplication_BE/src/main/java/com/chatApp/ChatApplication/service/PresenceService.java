package com.chatApp.ChatApplication.service;

import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class PresenceService {

    //user might have multiple sessions in the same room (multiple tabs)
    // roomId -> (sessionId -> username)
    private final ConcurrentMap<String, ConcurrentMap<String, String>> roomSessions = new ConcurrentHashMap<>();

    public void addUser(String roomId, String sessionId, String username) {
        if(!roomSessions.containsKey(roomId)){
            roomSessions.put(roomId,new ConcurrentHashMap<>());
        }
        roomSessions.get(roomId).put(sessionId,username);
    }

    public void removeUser(String roomId, String sessionId) {
        ConcurrentMap<String, String> sessions = roomSessions.get(roomId);
        if (sessions != null) {
            sessions.remove(sessionId);
            // cleanup empty room
            if (sessions.isEmpty()) {
                roomSessions.remove(roomId);
            }
        }
    }

    public Set<String> getUsers(String roomId) {
        ConcurrentMap<String, String> sessions = roomSessions.get(roomId);
        if (sessions == null) return Collections.emptySet();
        return new HashSet<>(sessions.values());
    }

    public long getUserCount(String roomId) {
        return getUsers(roomId).size();
    }
}
