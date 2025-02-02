package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.user.UserActivities;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserActivitiesRepository extends JpaRepository<UserActivities, Integer> {
}