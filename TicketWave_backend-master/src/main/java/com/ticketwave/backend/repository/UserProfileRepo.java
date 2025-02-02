package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.user.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepo extends JpaRepository<UserProfile, Integer> {
    List<UserProfile> findByApprovedFalse();

    List<UserProfile> findByDesignation(String designation);

    List<UserProfile> findByGrade(String grade);
}