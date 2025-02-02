package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserAccountDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAccountRepo extends JpaRepository<UserAccount, Integer> {
    
    List<UserAccount> findByRoles_RoleName(String roleName);


    UserAccount findByUsername(String username);

    UserAccount findByResetToken(String token);
}

