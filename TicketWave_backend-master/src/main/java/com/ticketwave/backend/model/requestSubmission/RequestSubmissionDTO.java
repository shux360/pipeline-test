package com.ticketwave.backend.model.requestSubmission;


import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class RequestSubmissionDTO {
    private Long requestSubmissionID;
    private LocalDateTime requestMadeDate;
    private Integer requesterID;
    private RequestStatus overallStatus;
    private Long workflowID;
    private Long requestID;
    private String identificationString; // Add this field
    private List<RequestSubmissionDetails> details;
    private List<RequestFormData> formData;

    public RequestSubmissionDTO(RequestSubmission request, String identificationString) {
        this.requestSubmissionID = request.getRequestSubmissionID();
        this.requestMadeDate = request.getRequestMadeDate();
        this.requesterID = request.getRequesterID();
        this.overallStatus = request.getOverallStatus();
        this.workflowID = request.getWorkflowID();
        this.requestID = request.getRequestID();
        this.identificationString = identificationString; // Set the identification string
        this.details = request.getDetails();
        this.formData = request.getFormData();
    }
}