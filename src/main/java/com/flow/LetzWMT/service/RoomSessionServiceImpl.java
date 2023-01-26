package com.flow.LetzWMT.service;

import com.flow.LetzWMT.entity.UsersRoomData;
import com.flow.LetzWMT.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomSessionServiceImpl implements RoomSessionService{

    @Autowired
    RoomRepository roomRepository;

    @Override
    public String getUserIDbySessionID(String session_ID){
        return roomRepository.getUserIDbySessionID(session_ID);
    }

    @Override
    public String getSessionIDbyUserID(String user_ID){
        return roomRepository.getSessionIDbyUserID(user_ID);
    }

    @Override
    public List<UsersRoomData> getAllUsersInRoom(String room_ID) {
        return roomRepository.findAllUsersInRoom(room_ID);
    }

    public String getRoomIDbyUserID(String user_ID){
        return roomRepository.getRoomIDbyUserID(user_ID);
    }

    @Override
    public UsersRoomData saveUserSessionToRoom(UsersRoomData userInRoom) {

        return roomRepository.save(userInRoom);
    }

    public Integer roomIdExists(String room_ID){
        return roomRepository.roomIdExists(room_ID);
    }

    @Override
    public UsersRoomData updateRoomID(String user_ID, String room_ID, boolean isUserHost){
        UsersRoomData usersRoomData = roomRepository.getReferenceById(user_ID);
        usersRoomData.setRoom_ID(room_ID);
        usersRoomData.setIsUserHost(isUserHost);
        roomRepository.save(usersRoomData);
        return usersRoomData;
    }

    @Override
    public void updateHostStatus(String user_ID, boolean isUserHost){
        roomRepository.updateHostStatus(user_ID,isUserHost);
    }

    @Override
    public void removeUserFromRoom(String user_ID){
        UsersRoomData usersRoomData = roomRepository.getReferenceById(user_ID);
        usersRoomData.setRoom_ID("");
        roomRepository.save(usersRoomData);
    }

    @Override
    public void deleteUserSessionBySessionID(String session_ID){
         roomRepository.deleteBySessionID(session_ID);
    }


    @Override
    public void deleteUserSessionFromRoom(String user_ID) {
        roomRepository.deleteById(user_ID);
    }
}
