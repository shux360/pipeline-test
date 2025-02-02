package com.ticketwave.backend.model.workflow.workflowAssignment;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workflow_level_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowLevelAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    @JsonBackReference
    private RequestWorkflowAssignment assignment;

    @Column(name = "level_id")
    private Long levelId;

    @Column(name = "escalating_time")
    private String escalatingTime;
}