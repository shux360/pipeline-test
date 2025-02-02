package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.request.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import java.util.List;

public interface RequestTypeRepository extends JpaRepository<RequestType, Long> {

    @Query("SELECT rt FROM RequestType rt JOIN rt.roles r WHERE r.roleName = :role")
    List<RequestType> findByRole(@Param("role") String role);

}