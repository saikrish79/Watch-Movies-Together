package com.flow.LetzWMT.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table
public class AppUser {

    @Id
    @Column
    private String ID;
    @Column
    private String name;
    @Column
    private boolean isAuthenticated;



    @Column
    private boolean isUserHost;

    public AppUser() {
    }

    public AppUser(String ID, String name, boolean isAuthenticated) {
        this.ID = ID;
        this.name = name;
        this.isAuthenticated = isAuthenticated;
    }

    public AppUser(String ID, String name, boolean isAuthenticated, boolean isUserHost) {
        this.ID = ID;
        this.name = name;
        this.isAuthenticated = isAuthenticated;
        this.isUserHost = isUserHost;
    }

    public boolean isUserHost() {
        return isUserHost;
    }

    public void setUserHost(boolean userHost) {
        isUserHost = userHost;
    }

    public boolean getIsAuthenticated() {
        return isAuthenticated;
    }

    public void setIsAuthenticated(boolean authenticated) {
        isAuthenticated = authenticated;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getID() {
        return ID;
    }

    public void setID(String ID) {
        this.ID = ID;
    }
}
