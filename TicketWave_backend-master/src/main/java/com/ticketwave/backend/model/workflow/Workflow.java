package com.ticketwave.backend.model.workflow;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
//import com.ticketwave.backend.model.request.Approval;
//import com.ticketwave.backend.model.request.RequestType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor


@Entity
public class Workflow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workflowId;

    private String workflowName;
    private String workflowDescription;
    private int noOfWorkflowLevel;

    @Enumerated(EnumType.STRING)
    private WorkflowType workflowType;

    // Removed levelType and added it at WorkflowLevel for each level-specific detail
    private String workflowStatus;
    private String workflowCategory;

    private int workflowCreatedBy;

    private String workflowCreatedDate;
    private String workflowUpdatedBy;
    private String workflowUpdatedDate;
    private String workflowDeletedBy;
    private String workflowDeletedDate;
    private String workflowDeletedReason;
    private String identificationString;

    @OneToMany(mappedBy = "workflow", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<WorkflowLevel> workflowLevels = new ArrayList<>();

    // Getters and setters
}
