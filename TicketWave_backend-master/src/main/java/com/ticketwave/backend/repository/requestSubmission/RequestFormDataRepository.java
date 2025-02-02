package com.ticketwave.backend.repository.requestSubmission;

import com.ticketwave.backend.model.requestSubmission.RequestFormData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestFormDataRepository extends JpaRepository<RequestFormData, Long> {
}