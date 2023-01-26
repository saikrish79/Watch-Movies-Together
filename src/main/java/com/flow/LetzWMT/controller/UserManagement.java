package com.flow.LetzWMT.controller;

import com.flow.LetzWMT.entity.AppUser;
import com.flow.LetzWMT.entity.UsersRoomData;
import com.flow.LetzWMT.service.RoomSessionService;
import com.flow.LetzWMT.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserManagement {

    @Autowired
    private RoomSessionService roomSessionService;

    @Autowired
    private UserService userService;
    @GetMapping("/newUser")
    public AppUser addNewUser(){
        //System.out.println("Request received for a new AppUser");
        String user_ID = generateGuestUserName();
        //System.out.println("Generated a guest appUser - " + user_ID);
        AppUser appUser = userService.saveUser(new AppUser(user_ID, user_ID, false, false));
        roomSessionService.saveUserSessionToRoom(new UsersRoomData(user_ID,"","", false));
        //System.out.println("AppUser persisted to database");
        return appUser;
    }

    @PostMapping("/changeUserName/{userID}/{userName}")
    public void changeUserName(@PathVariable String userID, @PathVariable String userName){
        //System.out.println("Request received for changeUserName - "+userID +" - "+userName);
        userService.updateName(userID,userName);
        AppUser user = userService.getSpecificUser(userID);
        //System.out.println("AppUser - " + user);
    }

    @GetMapping("/validateUserNameChange/{userID}/{userName}")
    public boolean validateUserNameChange(@PathVariable String userID, @PathVariable String userName){
        //System.out.println("Request received for to check user name - "+userID +" - "+userName);
        String roomID = roomSessionService.getRoomIDbyUserID(userID);
        //System.out.println(roomID);
        if(roomID != null){
            List<UsersRoomData> users = roomSessionService.getAllUsersInRoom(roomID);
            List<String> userIdList = users.stream().map(u -> u.getUser_ID()).collect(Collectors.toList());
            List<AppUser> usersList = userService.findAllUsers(userIdList);
            if(usersList.stream().anyMatch(u -> u.getName() == userName)){
                //System.out.println("False");
                return false;
            }
        }
        //System.out.println("True");
        return true;
    }



    @GetMapping("/removeUser/{user_ID}")
    public void removeUser(@PathVariable String user_ID){
        //System.out.println("Request received to remove AppUser");
        userService.removeUser(user_ID);
    }

    public String generateGuestUserName(){
        return "Guest_"+ (int)( new Random().nextFloat() * 1000000 );
    }
}
