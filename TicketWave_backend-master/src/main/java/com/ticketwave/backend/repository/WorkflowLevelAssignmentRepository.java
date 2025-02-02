package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.workflow.workflowAssignment.WorkflowLevelAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowLevelAssignmentRepository
        extends JpaRepository<WorkflowLevelAssignment, Long> {
    List<WorkflowLevelAssignment> findByAssignmentId(Long assignmentId);

}