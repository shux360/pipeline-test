package com.ticketwave.backend.model.requestSubmission;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "request_submission_details")
public class RequestSubmissionDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long submissionDetailsID;

    @ManyToOne
    @JoinColumn(name = "request_submission_id", nullable = false)
    @JsonBackReference
    private RequestSubmission requestSubmission;

    @Column(nullable = false)
    private Integer currentApproverID;

    @Column(nullable = false)
    private Integer requesterID;

    @Column(nullable = false)
    private String currentApproverLevel;

    @Column(nullable = false)
    private Long currentApproverLevelID;

    private Long nextApproverLevelID;

    private Integer currentWorkflowLevelNumber;

    private Integer workflowLength;

    private String comment;

    private Long byPassedBy;

    @Column(nullable = false)
    private LocalDateTime requestMadeDate;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.REQUEST_PENDING;
}