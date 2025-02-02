package com.ticketwave.backend.service.RequestSubmission;

import com.ticketwave.backend.model.requestSubmission.RequestStatus;
import com.ticketwave.backend.model.requestSubmission.RequestSubmission;
import com.ticketwave.backend.model.requestSubmission.RequestFormData;
import com.ticketwave.backend.model.requestSubmission.RequestSubmissionDetails;
import com.ticketwave.backend.model.workflow.Workflow;
import com.ticketwave.backend.repository.WorkflowRepo;
import com.ticketwave.backend.repository.requestSubmission.RequestSubmissionDetailsRepository;
import com.ticketwave.backend.repository.requestSubmission.RequestSubmissionRepository;
import com.ticketwave.backend.repository.requestSubmission.RequestFormDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RequestSubmissionService {

    @Autowired
    private RequestSubmissionRepository requestSubmissionRepository;

    @Autowired
    private RequestFormDataRepository requestFormDataRepository;

    @Autowired
    private RequestSubmissionDetailsRepository requestSubmissionDetailsRepository;


    private WorkflowRepo workflowRepository;

    @Transactional
    public RequestSubmission submitRequest(
            Long requestId,
            Long workflowId,
            Integer requesterId,
            Integer currentApproverId,
            String currentApproverLevel,
            Long currentApproverLevelId,
            Long nextApproverLevelId,
            Integer currentWorkflowLevelNumber,
            Integer workflowLength,
            List<RequestFormData> formData
    ) {
        // Create a new RequestSubmission
        RequestSubmission submission = new RequestSubmission();
        submission.setRequestID(requestId);
        submission.setWorkflowID(workflowId);
        submission.setRequesterID(requesterId);
        submission.setRequestMadeDate(LocalDateTime.now());
        submission.setOverallStatus(RequestStatus.REQUEST_PENDING);

        RequestSubmission savedSubmission = requestSubmissionRepository.save(submission);

        RequestSubmissionDetails details = new RequestSubmissionDetails();
        details.setRequestSubmission(savedSubmission);
        details.setCurrentApproverID(currentApproverId);
        details.setCurrentApproverLevel(currentApproverLevel);
        details.setCurrentApproverLevelID(currentApproverLevelId);
        details.setNextApproverLevelID(nextApproverLevelId);
        details.setRequesterID(requesterId);
        details.setCurrentWorkflowLevelNumber(currentWorkflowLevelNumber);
        details.setWorkflowLength(workflowLength);
        details.setRequestMadeDate(LocalDateTime.now());
        details.setStatus(RequestStatus.REQUEST_PENDING);

        requestSubmissionDetailsRepository.save(details);
        savedSubmission.getDetails().add(details);

        if (formData != null) {
            for (RequestFormData data : formData) {
                data.setRequestSubmission(savedSubmission);
                requestFormDataRepository.save(data);
            }
            savedSubmission.setFormData(formData);
        }


        return requestSubmissionRepository.save(savedSubmission);
    }



    @Transactional
    public void approveRequest(
            Long submissionDetailsID,
            Long requestSubmissionId,
            Integer currentApproverId,
            Long nextApproverLevelId,
            Integer currentWorkflowLevelNumber,
            String currentApproverLevel
    ) {
        // Fetch the existing request submission details by submissionDetailsID
        RequestSubmissionDetails existingDetails = requestSubmissionDetailsRepository
                .findById(submissionDetailsID)
                .orElseThrow(() -> new RuntimeException("Request submission details not found"));

        // Update the status of the existing row to APPROVED
        existingDetails.setStatus(RequestStatus.REQUEST_APPROVED);
        requestSubmissionDetailsRepository.save(existingDetails);

        // Fetch the request submission by requestSubmissionId
        RequestSubmission requestSubmission = requestSubmissionRepository
                .findById(requestSubmissionId)
                .orElseThrow(() -> new RuntimeException("Request submission not found"));

        // Create a new RequestSubmissionDetails row with updated data
        RequestSubmissionDetails newDetails = new RequestSubmissionDetails();
        newDetails.setRequestSubmission(requestSubmission);
        newDetails.setCurrentApproverID(currentApproverId);
        newDetails.setNextApproverLevelID(nextApproverLevelId);
        newDetails.setCurrentApproverLevelID(existingDetails.getNextApproverLevelID());
        newDetails.setCurrentWorkflowLevelNumber(currentWorkflowLevelNumber);
        newDetails.setRequesterID(existingDetails.getRequesterID());
        newDetails.setCurrentApproverLevel(currentApproverLevel);
        newDetails.setWorkflowLength(existingDetails.getWorkflowLength());
        newDetails.setRequestMadeDate(LocalDateTime.now());
        newDetails.setStatus(RequestStatus.REQUEST_PENDING);

        // Save the new details
        requestSubmissionDetailsRepository.save(newDetails);
    }

    public List<RequestSubmission> getRequestsByRequesterId(Integer requesterId) {
        return requestSubmissionRepository.findByRequesterID(requesterId);
    }

    public String getWorkflowIdentificationString(Long workflowID) {
        Workflow workflow = workflowRepository.findById(workflowID)
                .orElseThrow(() -> new RuntimeException("Workflow not found"));
        return workflow.getIdentificationString();
    }
    @Transactional
    public void rejectRequest(
            Long submissionDetailsID,
            Long requestSubmissionId,
            Integer currentApproverId,
            String comment
    ) {
        // Fetch the existing request submission details by submissionDetailsID
        RequestSubmissionDetails existingDetails = requestSubmissionDetailsRepository
                .findById(submissionDetailsID)
                .orElseThrow(() -> new RuntimeException("Request submission details not found"));

        // Update the status of the existing row to REJECTED
        existingDetails.setStatus(RequestStatus.REQUEST_REJECTED);
        existingDetails.setComment(comment);
        requestSubmissionDetailsRepository.save(existingDetails);

        // Fetch the request submission by requestSubmissionId
        RequestSubmission requestSubmission = requestSubmissionRepository
                .findById(requestSubmissionId)
                .orElseThrow(() -> new RuntimeException("Request submission not found"));

        // Update the overall status of the request submission to REJECTED
        requestSubmission.setOverallStatus(RequestStatus.REQUEST_REJECTED);
        requestSubmissionRepository.save(requestSubmission);
    }

    @Transactional
    public void bypassRequest(
            Long submissionDetailsID,
            Long requestSubmissionId,
            Integer currentApproverId,
            Long nextApproverLevelId,
            Integer currentWorkflowLevelNumber,
            String currentApproverLevel,
            Long byPassedBy,
            String comment 
    ) {
        
        RequestSubmissionDetails existingDetails = requestSubmissionDetailsRepository
                .findById(submissionDetailsID)
                .orElseThrow(() -> new RuntimeException("Request submission details not found"));
    
      
        existingDetails.setStatus(RequestStatus.REQUEST_PENDING);
        requestSubmissionDetailsRepository.save(existingDetails);
    
       
        RequestSubmission requestSubmission = requestSubmissionRepository
                .findById(requestSubmissionId)
                .orElseThrow(() -> new RuntimeException("Request submission not found"));
    
        
        RequestSubmissionDetails newDetails = new RequestSubmissionDetails();
        newDetails.setRequestSubmission(requestSubmission);
        newDetails.setCurrentApproverID(currentApproverId);
        newDetails.setNextApproverLevelID(nextApproverLevelId);
        newDetails.setCurrentApproverLevelID(-1L);
        newDetails.setCurrentWorkflowLevelNumber(currentWorkflowLevelNumber);
        newDetails.setRequesterID(existingDetails.getRequesterID());
        newDetails.setCurrentApproverLevel(currentApproverLevel);
        newDetails.setWorkflowLength(existingDetails.getWorkflowLength());
        newDetails.setRequestMadeDate(LocalDateTime.now());
        newDetails.setStatus(RequestStatus.REQUEST_BYPASSED);
        newDetails.setByPassedBy(byPassedBy); 
        newDetails.setComment(comment);
    
        // Save the new request submission details
        requestSubmissionDetailsRepository.save(newDetails);

    }
}
