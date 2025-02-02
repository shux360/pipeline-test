package com.ticketwave.backend.controller.RequestSubmission;

import com.ticketwave.backend.model.requestSubmission.RequestStatus;
import com.ticketwave.backend.model.requestSubmission.RequestSubmission;
import com.ticketwave.backend.model.requestSubmission.RequestFormData;
import com.ticketwave.backend.model.requestSubmission.RequestSubmissionDetails;
import com.ticketwave.backend.repository.requestSubmission.RequestSubmissionDetailsRepository;
import com.ticketwave.backend.service.RequestSubmission.RequestSubmissionService;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/request-submissions")
public class RequestSubmissionController {

    @Autowired
    private RequestSubmissionService requestSubmissionService;

    @Autowired
    private RequestSubmissionDetailsRepository requestSubmissionDetailsRepository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitRequest(
            @RequestParam Long requestId,
            @RequestParam Long workflowId,
            @RequestParam Integer requesterId,
            @RequestParam Integer currentApproverId,
            @RequestParam String currentApproverLevel,
            @RequestParam Long currentApproverLevelId,
            @RequestParam Long nextApproverLevelId,
            @RequestParam Integer currentWorkflowLevelNumber,
            @RequestParam Integer workflowLength,
            @RequestBody List<RequestFormData> formData
    ) {
        System.out.println("form submission: " );
        try {
            RequestSubmission submission = requestSubmissionService.submitRequest(
                    requestId,
                    workflowId,
                    requesterId,
                    currentApproverId,
                    currentApproverLevel,
                    currentApproverLevelId,
                    nextApproverLevelId,
                    currentWorkflowLevelNumber,
                    workflowLength,
                    formData

            );
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingRequests(@RequestParam Integer currentUserID) {
        try {
            System.out.println("pending requests: " + currentUserID);
            // Fetch pending requests for the current approver
            List<RequestSubmissionDetails> pendingDetails = requestSubmissionDetailsRepository
                    .findByCurrentApproverIDAndStatus(currentUserID, RequestStatus.REQUEST_PENDING);

            // Extract the RequestSubmission objects
            List<RequestSubmission> pendingRequests = pendingDetails.stream()
                    .map(RequestSubmissionDetails::getRequestSubmission)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(pendingRequests);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/curent-approver/all")
    public ResponseEntity<?> getAllRequests(@RequestParam Integer currentUserID) {
        try {
            System.out.println("all requests: " + currentUserID);
            // Fetch all requests for the current approver
            List<RequestSubmissionDetails> allDetails = requestSubmissionDetailsRepository
                    .findByCurrentApproverID(currentUserID);

            // Extract the RequestSubmission objects
            List<RequestSubmission> allRequests = allDetails.stream()
                    .map(RequestSubmissionDetails::getRequestSubmission)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(allRequests);
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @PostMapping("/approve")
    public ResponseEntity<?> approveRequest(
            @RequestParam Long submissionDetailsID,
            @RequestParam Long requestSubmissionId,
            @RequestParam Integer currentApproverId,
            @RequestParam(required = false) Long nextApproverLevelId,
            @RequestParam Integer currentWorkflowLevelNumber,
            @RequestParam String currentApproverLevel
    ) {
        try {
            System.out.println( "approve request: " + submissionDetailsID + " " + requestSubmissionId + " " + currentApproverId + " " + nextApproverLevelId + " " + currentWorkflowLevelNumber + " " + currentApproverLevel);
            // Call the service layer to handle the approval logic
            requestSubmissionService.approveRequest(
                    submissionDetailsID,
                    requestSubmissionId,
                    currentApproverId,
                    nextApproverLevelId,
                    currentWorkflowLevelNumber,
                    currentApproverLevel
            );

            return ResponseEntity.ok("Request approved successfully and new row created");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // New endpoint to fetch all requests submitted by the current user
    @GetMapping("/requester")
    public ResponseEntity<?> getRequestsByRequesterId(@RequestParam Integer requesterId) {
        try {
            List<RequestSubmission> requests = requestSubmissionService.getRequestsByRequesterId(requesterId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/reject")
    public ResponseEntity<?> rejectRequest(
            @RequestParam Long submissionDetailsID,
            @RequestParam Long requestSubmissionId,
            @RequestParam Integer currentApproverId,
            @RequestParam String comment 
    ) {
        try {
            
            System.out.println("reject request: " + submissionDetailsID + " " + requestSubmissionId + " " + currentApproverId + " " + comment);
          
            requestSubmissionService.rejectRequest(
                    submissionDetailsID,
                    requestSubmissionId,
                    currentApproverId,
                    comment
            );
    
            return ResponseEntity.ok("Request rejected successfully and new row created");
        } catch (Exception e) {
            System.out.println(e);
            return ResponseEntity.status(HttpStatus.SC_INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }

    
    @PostMapping("/bypass")
    public ResponseEntity<?> bypassRequest(
            @RequestParam Long submissionDetailsID,
            @RequestParam Long requestSubmissionId,
            @RequestParam Integer currentApproverId,
            @RequestParam(required = false) Long nextApproverLevelId,
            @RequestParam Integer currentWorkflowLevelNumber,
            @RequestParam(required = false, defaultValue = "DEFAULT") String currentApproverLevel,
            @RequestParam Long byPassedBy,
            @RequestParam(required = false) String comment 
    ) {
        try {
            System.out.println("bypass request: " +
                    submissionDetailsID + " " +
                    requestSubmissionId + " " +
                    currentApproverId + " " +
                    nextApproverLevelId + " " +
                    currentWorkflowLevelNumber + " " +
                    currentApproverLevel + " " +
                    byPassedBy);
    
            requestSubmissionService.bypassRequest(
                    submissionDetailsID,
                    requestSubmissionId,
                    currentApproverId,
                    nextApproverLevelId,
                    currentWorkflowLevelNumber,
                    currentApproverLevel,
                    byPassedBy,
                    comment 
            );
    
            return ResponseEntity.ok("Request bypassed successfully and new row created");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}