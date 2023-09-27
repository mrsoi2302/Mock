package com.example.demo;

import jakarta.annotation.Nullable;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User,Long> {
    @Query("select u from User u where :username is null or u.username like concat('%',:username,'%')" +
            "and" +
            ":password is null or u.password like concat('%',:password,'%')")
    List<User> listAll(@Param("username") String username, @Param("password") String password, Pageable pageable);

    User findByUsername(String username);
}
