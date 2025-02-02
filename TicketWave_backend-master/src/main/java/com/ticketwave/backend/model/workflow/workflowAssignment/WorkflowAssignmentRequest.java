package com.ticketwave.backend.model.workflow.workflowAssignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowAssignmentRequest {
    private List<Long> requestIds;
    private List<WorkflowWithLevels> workflows;
}