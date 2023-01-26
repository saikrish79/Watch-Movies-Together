package com.flow.LetzWMT.repository;

import com.flow.LetzWMT.entity.UsersRoomData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface RoomRepository extends JpaRepository<UsersRoomData, String> {

    @Transactional
    @Modifying
    @Query("delete from UsersRoomData u where u.session_ID = ?1")
    void deleteBySessionID(String session_ID);

    @Transactional
    @Modifying
    @Query("update UsersRoomData u set isUserHost = ?2 where u.user_ID = ?1")
    void updateHostStatus(String user_ID, boolean isUserHost);

    @Query("select COUNT(*) from UsersRoomData u where u.room_ID = ?1")
    Integer roomIdExists(String room_ID);

    @Query("select u from UsersRoomData u where u.room_ID = ?1")
    List<UsersRoomData> findAllUsersInRoom(String room_ID);

    @Query("select u.user_ID from UsersRoomData u where u.session_ID = ?1")
    String getUserIDbySessionID(String session_ID);

    @Query("select u.room_ID from UsersRoomData u where u.user_ID = ?1")
    String getRoomIDbyUserID(String user_ID);

    @Query("select u.session_ID from UsersRoomData u where u.user_ID = ?1")
    String getSessionIDbyUserID(String user_ID);
}
