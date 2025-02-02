package com.ticketwave.backend.repository.requestSubmission;

import com.ticketwave.backend.model.requestSubmission.RequestSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestSubmissionRepository extends JpaRepository<RequestSubmission, Long> {

    List<RequestSubmission> findByRequesterID(Integer requesterID);}
