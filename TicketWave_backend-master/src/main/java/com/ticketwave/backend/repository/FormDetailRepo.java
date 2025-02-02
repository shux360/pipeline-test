package com.ticketwave.backend.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ticketwave.backend.model.form.FormDetail;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FormDetailRepo extends JpaRepository<FormDetail, Long> {
    Optional<FormDetail> findByRequestId(Long requestId);
}