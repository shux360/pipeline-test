package com.ticketwave.backend.model.workflow.workflowAssignment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "request_workflow_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestWorkflowAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id")
    private Long requestId;

    @Column(name = "workflow_id")
    private Long workflowId;

    @Column(name = "assigned_date")
    private LocalDateTime assignedDate;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "assignment")
    @JsonIgnore
    private List<WorkflowLevelAssignment> levelAssignments;
}