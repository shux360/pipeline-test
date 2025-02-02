package com.ticketwave.backend.model.workflow;

//import com.ticketwave.backend.model.request.ApprovalDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor

public class WorkflowDTO {
    private String workflowName;
    private String workflowDescription;
    private int noOfWorkflowLevel;
    private WorkflowType workflowType;
    private String identificationString;

    // Getters and Setters
}

