package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.user.UserActivities;
import com.ticketwave.backend.repository.UserActivitiesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class UserActivitiesController {

    @Autowired
    private UserActivitiesRepository userActivitiesRepository;

    @GetMapping("/user-activities")
    public ResponseEntity<List<UserActivities>> getUserActivities() {
        List<UserActivities> userActivities = userActivitiesRepository.findAll();
        return ResponseEntity.ok(userActivities);
    }
}