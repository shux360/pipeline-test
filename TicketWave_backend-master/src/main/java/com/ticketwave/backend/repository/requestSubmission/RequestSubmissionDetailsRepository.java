package com.ticketwave.backend.repository.requestSubmission;

import com.ticketwave.backend.model.requestSubmission.RequestStatus;
import com.ticketwave.backend.model.requestSubmission.RequestSubmissionDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RequestSubmissionDetailsRepository extends JpaRepository<RequestSubmissionDetails, Long> {
    List<RequestSubmissionDetails> findByCurrentApproverIDAndStatus(Integer currentApproverID, RequestStatus status);
    //findall requests with current approver id
    List<RequestSubmissionDetails> findByCurrentApproverID(Integer currentApproverID);
}