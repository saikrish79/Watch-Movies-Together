package com.flow.LetzWMT.controller;

import com.flow.LetzWMT.entity.AppUser;
import com.flow.LetzWMT.entity.UsersRoomData;
import com.flow.LetzWMT.service.RoomSessionService;
import com.flow.LetzWMT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/room")
public class RoomManagement {

    @Autowired
    RoomSessionService roomSessionService;
    @Autowired
    private UserService userService;

    @GetMapping("/createRoom/{user_ID}")
    public String createNewRoom(@PathVariable String user_ID){
        String room_ID = new Random().ints(65, 123)
            .filter(i -> (i <= 90 || i >= 97))
            .limit(9)
            .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
            .toString();
        roomSessionService.updateRoomID(user_ID, room_ID, true);
        userService.updateHostStatus(user_ID, true);
        //System.out.println(room_ID);
        return room_ID;
    }

    @GetMapping("/checkIfRoomExists/{room_ID}")
    public boolean checkIfRoomExists(@PathVariable String room_ID){
       return (roomSessionService.roomIdExists(room_ID) > 0?true:false);
    }

    @GetMapping("/joinRoom/{user_ID}/{room_ID}")
    public List<AppUser> joinRoom(@PathVariable String user_ID, @PathVariable String room_ID){
        roomSessionService.updateRoomID(user_ID, room_ID, false);
        userService.updateHostStatus(user_ID, false);
        List<UsersRoomData> users = roomSessionService.getAllUsersInRoom(room_ID);
        List<String> usersList = users.stream().filter(u -> !u.getUser_ID().equals(user_ID)).map(u -> u.getUser_ID()).collect(Collectors.toList());
        //usersList.forEach(System.out::println);
        return userService.findAllUsers(usersList);
    }

    @GetMapping("/usersInRoom/{user_ID}/{room_ID}")
    public List<AppUser> usersInRoom(@PathVariable String user_ID, @PathVariable String room_ID){
        List<UsersRoomData> users = roomSessionService.getAllUsersInRoom(room_ID);
        List<String> usersList = users.stream().filter(u -> !u.getUser_ID().equals(user_ID)).map(u -> u.getUser_ID()).collect(Collectors.toList());
        //usersList.forEach(System.out::println);
        return userService.findAllUsers(usersList);
    }

    @GetMapping("/exitRoom/{user_ID}")
    public String exitRoom(@PathVariable String user_ID){
        userService.updateHostStatus(user_ID,false);
        roomSessionService.removeUserFromRoom(user_ID);
        return "";
    }
}
