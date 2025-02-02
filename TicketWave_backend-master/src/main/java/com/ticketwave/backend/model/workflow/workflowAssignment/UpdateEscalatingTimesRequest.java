package com.ticketwave.backend.model.workflow.workflowAssignment;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEscalatingTimesRequest {
    private String workflowIdentificationString;
    private String requestType;
    private List<WorkflowLevelDTO> levelAssignments;

    // Getters and Setters
    public String getWorkflowIdentificationString() {
        return workflowIdentificationString;
    }

    public void setWorkflowIdentificationString(String workflowIdentificationString) {
        this.workflowIdentificationString = workflowIdentificationString;
    }

    public String getRequestType() {
        return requestType;
    }

    public void setRequestType(String requestType) {
        this.requestType = requestType;
    }

    public List<WorkflowLevelDTO> getLevelAssignments() {
        return levelAssignments;
    }

    public void setLevelAssignments(List<WorkflowLevelDTO> levelAssignments) {
        this.levelAssignments = levelAssignments;
    }
}