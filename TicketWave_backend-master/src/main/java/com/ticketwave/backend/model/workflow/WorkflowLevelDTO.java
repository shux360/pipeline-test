package com.ticketwave.backend.model.workflow;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class WorkflowLevelDTO {
    private String approvalLevel;
    private LevelType levelType;
    private String authPerson;
    private boolean allowBypass;
    private boolean allowRevert;

    // Getters and Setters

}
