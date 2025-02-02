package com.ticketwave.backend.model.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import java.time.LocalDateTime;

//@Entity
//public class UserActivities {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private int id; // Auto-increment primary key
//
//    @Column(name = "userId", nullable = false) // Map to the `userId` column in the database
//    private int userId; // Foreign key to UserAccount
//
//    @Column(nullable = false)
//    private String username;
//
//    @Column(nullable = false)
//    private LocalDateTime lastLoginTime;
//
//    // Getters and Setters
//
//    public int getUserId() {
//        return userId;
//    }
//
//    public void setUserId(int userId) {
//        this.userId = userId;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public LocalDateTime getLastLoginTime() {
//        return lastLoginTime;
//    }
//
//    public void setLastLoginTime(LocalDateTime lastLoginTime) {
//        this.lastLoginTime = lastLoginTime;
//    }
//}



@Entity
public class UserActivities {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "userId", nullable = false) // Correctly map to the database column
    private int userId;

    @Column(nullable = false)
    private String username;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "last_login_time", nullable = false) // Specify the column name for clarity
    private LocalDateTime lastLoginTime;

    // Getters and Setters
       // Getters and Setters

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getLastLoginTime() {
        return lastLoginTime;
    }

    public void setLastLoginTime(LocalDateTime lastLoginTime) {
        this.lastLoginTime = lastLoginTime;
    }
}
