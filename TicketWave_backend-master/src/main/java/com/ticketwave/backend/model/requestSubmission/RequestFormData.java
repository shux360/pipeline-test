package com.ticketwave.backend.model.requestSubmission;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "request_form_data")
public class RequestFormData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long formDataId;

    @ManyToOne
    @JoinColumn(name = "request_submission_id", nullable = false)
    @JsonBackReference
    private RequestSubmission requestSubmission;

    @Column(nullable = false)
    private String elementId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String value;
}