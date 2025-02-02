package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.user.DeletedUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeletedUserRepo extends JpaRepository<DeletedUser, Integer> {

}