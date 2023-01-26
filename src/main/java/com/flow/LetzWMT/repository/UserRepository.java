package com.flow.LetzWMT.repository;

import com.flow.LetzWMT.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, String> {
    @Query("select au from AppUser au where au.ID like ?1")
    AppUser getSpecificUser(String user_ID);

    @Transactional
    @Modifying
    @Query("update AppUser au set au.name = ?2 where au.ID = ?1")
    void updateName(String user_ID, String name);

    @Transactional
    @Modifying
    @Query("update AppUser u set isUserHost = ?2 where u.ID = ?1")
    void updateHostStatus(String user_ID, boolean isUserHost);
}
