package com.ticketwave.backend.model.workflow;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor


@Entity
public class WorkflowLevel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "workflow_level_id")
    private Long id;

    @Column(nullable = false)
    private String approvalLevel;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LevelType levelType;

    @Column(nullable = true)
    private String authPerson;

    @Column(nullable = false)
    private boolean allowBypass;

    @Column(nullable = false)
    private boolean allowRevert;

//    @Enumerated(EnumType.STRING)
//    private WorkflowLevelType workflowLevelType;  // Enum to specify level type if applicable

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    @JsonBackReference
    private Workflow workflow;

    // Getters and setters
}
