package com.flow.LetzWMT.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class UsersRoomData {

    @Id
    @Column
    private String user_ID;
    @Column
    private String session_ID;
    @Column
    private String room_ID;
    @Column
    private boolean isUserHost;

    public UsersRoomData(String user_ID, String session_ID, String room_ID, boolean isUserHost) {
        this.user_ID = user_ID;
        this.session_ID = session_ID;
        this.room_ID = room_ID;
        this.isUserHost = isUserHost;
    }

    public UsersRoomData() {
    }

    public UsersRoomData(String user_ID, String session_ID, String room_ID) {
        this.user_ID = user_ID;
        this.session_ID = session_ID;
        this.room_ID = room_ID;
    }

    public String getUser_ID() {
        return user_ID;
    }

    public void setUser_ID(String user_ID) {
        this.user_ID = user_ID;
    }

    public String getSession_ID() {
        return session_ID;
    }

    public void setSession_ID(String session_ID) {
        this.session_ID = session_ID;
    }

    public String getRoom_ID() {
        return room_ID;
    }

    public void setRoom_ID(String room_ID) {
        this.room_ID = room_ID;
    }

    public boolean isUserHost() {
        return isUserHost;
    }

    public void setIsUserHost(boolean isUserHost) {
        this.isUserHost = isUserHost;
    }
}
