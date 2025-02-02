package com.ticketwave.backend.model.workflow.workflowAssignment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowWithLevels {
    private Long workflowId;
    private List<WorkflowLevelDTO> workflowLevels;
}