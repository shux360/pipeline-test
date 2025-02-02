package com.ticketwave.backend.service;

import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserPrincipal;
import com.ticketwave.backend.repository.UserAccountRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class CurrentUser {
    @Autowired
    private UserAccountRepo userAccountRepo;


    public UserAccount getCurrentUser() {
        System.out.println("Current User");
        // Get the currently authenticated user
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();
        // Find the corresponding user account
        return userAccountRepo.findByUsername(username);
    }

}
