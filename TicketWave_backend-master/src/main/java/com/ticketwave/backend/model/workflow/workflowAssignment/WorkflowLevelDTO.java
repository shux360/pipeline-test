package com.ticketwave.backend.model.workflow.workflowAssignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowLevelDTO {
    private Long id;
    private String approvalLevel;
    private String escalatingTime;
}