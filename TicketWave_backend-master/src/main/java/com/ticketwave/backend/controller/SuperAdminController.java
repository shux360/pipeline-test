package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.user.UserAccountDTO;
import com.ticketwave.backend.model.user.UserProfile;
import com.ticketwave.backend.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class SuperAdminController {
    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/pending-users")
    public List<UserAccountDTO> getPendingApprovals() {
        return userProfileService.getPendingApprovals();
    }

    @GetMapping("/Pending-User-Details/{userId}")
    public UserAccountDTO getUserDetailsById(@PathVariable int userId) {
        return userProfileService.getUserDetailsById(userId);
    }

    @PostMapping("/approve-user/{userId}")
    public ResponseEntity<String> approveUser(@PathVariable int userId) {
        userProfileService.approveUser(userId);
        return ResponseEntity.ok("User approved");
    }

    @PostMapping("/reject-user/{userId}")
    public void rejectUser(@PathVariable int userId, @RequestBody Map<String, String> payload) {
        String comment = payload.get("comment");
        userProfileService.rejectUser(userId, comment);
    }
}
