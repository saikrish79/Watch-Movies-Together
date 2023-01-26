package com.flow.LetzWMT.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class SocketMessagePayload {

    private String event;
    private String fromUser;
    private String msg;

    public SocketMessagePayload(String event, String fromUser, String msg, String toUser) {
        this.event = event;
        this.fromUser = fromUser;
        this.msg = msg;
        this.toUser = toUser;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public SocketMessagePayload(String event, String fromUser, String toUser) {
        this.event = event;
        this.fromUser = fromUser;
        this.toUser = toUser;
    }

    public SocketMessagePayload() {
    }

    private String toUser;

    public String getToUser() {
        return toUser;
    }

    public void setToUser(String toUser) {
        this.toUser = toUser;
    }

    public String getFromUser() {
        return fromUser;
    }

    public void setFromUser(String fromUser) {
        this.fromUser = fromUser;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }
}
