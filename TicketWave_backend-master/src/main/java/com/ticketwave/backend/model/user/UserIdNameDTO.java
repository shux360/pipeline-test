package com.ticketwave.backend.model.user;

import lombok.Data;

@Data
public class UserIdNameDTO {
    private int userId;
    private String name;

    public UserIdNameDTO(int userId, String name) {
        this.userId = userId;
        this.name = name;
    }
}