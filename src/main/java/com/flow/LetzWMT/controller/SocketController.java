package com.flow.LetzWMT.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.flow.LetzWMT.entity.SocketMessagePayload;
import com.flow.LetzWMT.service.RoomSessionService;
import org.springframework.beans.factory.annotation.Autowired;
import com.flow.LetzWMT.entity.UsersRoomData;
import com.flow.LetzWMT.service.UserService;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class SocketController extends TextWebSocketHandler {

    //List of all users using the app
    Map<String, WebSocketSession> allSessions = new HashMap<>();
    @Autowired
    private RoomSessionService roomSessionService;

    @Autowired
    private UserService userService;



    @Override
    public void afterConnectionEstablished(WebSocketSession session)
            throws Exception{
        allSessions.put(session.getId(),session);

    }

    @Override
    protected void handleTextMessage(WebSocketSession session,
                                     TextMessage message){

        try {
            SocketMessagePayload messageData = new ObjectMapper().readValue(message.getPayload(), SocketMessagePayload.class);
            //System.out.println("Websocket message received");
                switch (messageData.getEvent()) {
                    case "newUserSession":
                    {
                        //System.out.println("User = "+messageData.getFromUser()+" session - "+session.getId());
                        roomSessionService.saveUserSessionToRoom(new UsersRoomData(messageData.getFromUser(), session.getId(), "", false));
                    }
                    break;
                    case "newUserRequest": {
                        //System.out.println("Inside "+messageData.getFromUser());
                        userNotification(messageData.getFromUser(), session, "newUser",  messageData.getMsg(), new ObjectMapper().writeValueAsString(userService.getSpecificUser(messageData.getFromUser())));
                    }
                    break;
                    case "changeUserName": {
                        //System.out.println("Inside changeUserName - "+messageData.getFromUser());
                        String roomID = roomSessionService.getRoomIDbyUserID(messageData.getFromUser());
                        userNotification(messageData.getFromUser(), session, "changeUserName",  roomID, new ObjectMapper().writeValueAsString(userService.getSpecificUser(messageData.getFromUser())));
                    }
                    break;
                    case "makeAnotherUserHost": {
                        makeAnotherUserHost(messageData.getFromUser(),messageData.getMsg());

                    }
                    break;
                    case "userExit": {
                        //System.out.println("User exiting room "+messageData.getFromUser());
                        userNotification(messageData.getFromUser(), session, "userExit", messageData.getMsg(), new ObjectMapper().writeValueAsString(userService.getSpecificUser(messageData.getFromUser())));
                    }
                    break;
                    default:
                        sendMessageToSpecificUser(messageData.getToUser(),message);
                }
        }
        catch(Exception e){
            e.printStackTrace();
        }

    }

    @Override
    public void afterConnectionClosed(WebSocketSession session,
                                      CloseStatus status)
            throws Exception{
        try {
            String session_ID = session.getId();
            allSessions.remove(session_ID);

           // //System.out.println(session_ID);
            String user_ID = roomSessionService.getUserIDbySessionID(session_ID);
            String room_ID = roomSessionService.getRoomIDbyUserID(user_ID);
            userNotification(user_ID, session, "userExit", room_ID, new ObjectMapper().writeValueAsString(userService.getSpecificUser(user_ID)));
            if(user_ID != null && !user_ID.isBlank()) {
                    makeAnotherUserHost(user_ID, room_ID);
                    userService.removeUser(user_ID);
                    roomSessionService.deleteUserSessionBySessionID(session_ID);
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void userNotification(String user_ID, WebSocketSession session, String event, String room_ID, String msg){
        try {
            //System.out.println(room_ID);
            List<UsersRoomData> users = roomSessionService.getAllUsersInRoom(room_ID);
            //for(UsersRoomData user : users)
                //System.out.println(user.getUser_ID());
            for (String session_ID : users.stream().filter(u -> !u.getUser_ID().equals(user_ID)).map(u -> u.getSession_ID()).collect(Collectors.toList())) {
                //System.out.println(session_ID);
                WebSocketSession wss = allSessions.get(session_ID);
                if(wss != null) {
                    synchronized (wss) {
                        //System.out.println("Notifying - " + session_ID);
                        wss.sendMessage(new TextMessage(new ObjectMapper().writeValueAsString(new SocketMessagePayload(event, user_ID, msg, ""))));
                    }
                }
            }
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    public void sendMessageToSpecificUser(String toUser, TextMessage message){
        try {
            //System.out.println(toUser);
            String session_ID = roomSessionService.getSessionIDbyUserID(toUser);
            //System.out.println(session_ID);
            WebSocketSession wss = allSessions.get(session_ID);
            if(wss.isOpen())
                synchronized (wss) {
                wss.sendMessage(message);
            }
        }
        catch (Exception e){
            //System.out.println(e);
        }
    }

    public void makeAnotherUserHost(String fromUser, String roomID) {
        try {
            //System.out.println("Inside makeAnotherUserHost - " + fromUser);
            userService.updateHostStatus(fromUser, false);
            //System.out.println(roomID);
            List<UsersRoomData> users = roomSessionService.getAllUsersInRoom(roomID);
            for (UsersRoomData u : users) {
                if (!u.getUser_ID().equals(fromUser)) {
                    userService.updateHostStatus(u.getUser_ID(), true);
                    sendMessageToSpecificUser(u.getUser_ID(), new TextMessage(new ObjectMapper().writeValueAsString(new SocketMessagePayload("makeUserHost", fromUser, "", ""))));
                    userNotification(u.getUser_ID(), null, "updateUsersList",  roomID, "");
                    break;
                }
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
    }
}
