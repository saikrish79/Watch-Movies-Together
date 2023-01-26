package com.flow.LetzWMT.service;

import com.flow.LetzWMT.entity.UsersRoomData;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

public interface RoomSessionService {

    UsersRoomData saveUserSessionToRoom(UsersRoomData userInRoom);

    String getRoomIDbyUserID(String user_ID);

    String getSessionIDbyUserID(String user_ID);

    Integer roomIdExists(String room_ID);

    public UsersRoomData updateRoomID(String user_ID, String room_ID, boolean isUserHost);
    public void updateHostStatus(String user_ID, boolean isUserHost);
    List<UsersRoomData> getAllUsersInRoom(String room_ID);
    void deleteUserSessionBySessionID(String session_ID);

    void removeUserFromRoom(String user_ID);

    String getUserIDbySessionID(String session_ID);
    void deleteUserSessionFromRoom(String user_ID);



}
