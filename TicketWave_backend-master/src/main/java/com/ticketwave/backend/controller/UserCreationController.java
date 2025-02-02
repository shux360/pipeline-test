package com.ticketwave.backend.controller;


import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserAccountDTO;
import com.ticketwave.backend.service.UserAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserCreationController {

    @Autowired
    private UserAccountService userAccountService;

    @PostMapping("/create_user")
    public ResponseEntity<?> createUser(@RequestBody UserAccountDTO userAccountDTO) throws Exception {
        try{
            UserAccount createdUser = userAccountService.createUser(userAccountDTO);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
}
