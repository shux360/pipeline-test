package com.ticketwave.backend.model.requestSubmission;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "request_submissions")
public class RequestSubmission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestSubmissionID;

    @Column(nullable = false)
    private LocalDateTime requestMadeDate;

    @Column(nullable = false)
    private Integer requesterID;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus overallStatus = RequestStatus.REQUEST_PENDING;

    @Column(nullable = false)
    private Long workflowID;

    @Column(nullable = false)
    private Long requestID;

    @OneToMany(mappedBy = "requestSubmission", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<RequestSubmissionDetails> details;

    @OneToMany(mappedBy = "requestSubmission", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<RequestFormData> formData;

    public RequestSubmission() {
        this.details = new ArrayList<>();
        this.formData = new ArrayList<>();
    }
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long submissionId;
//
//    @Column(nullable = false)
//    private Long requestId;
//
//    @Column(nullable = false)
//    private Long workflowId;
//
//    @Column(nullable = false)
//    private Integer requesterId;
//
//    @Column(nullable = false)
//    private LocalDateTime submittedAt;
//
//    @Column(nullable = false)
//    @Enumerated(EnumType.STRING)
//    private RequestStatus status = RequestStatus.REQUEST_PENDING;
//
//    private Integer currentApproverId;
//    private Integer currentApproverLevelId;
//    private Integer nextApproverLevelId;
//
//    @Column(nullable = false)
//    private String currentApproverLevel;
//
//    @OneToMany(mappedBy = "submittedRequest", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<SubmittedFormData> formData;
}