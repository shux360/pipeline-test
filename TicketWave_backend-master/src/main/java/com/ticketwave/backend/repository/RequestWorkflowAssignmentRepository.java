package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.workflow.workflowAssignment.RequestWorkflowAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestWorkflowAssignmentRepository
        extends JpaRepository<RequestWorkflowAssignment, Long> {
    List<RequestWorkflowAssignment> findByRequestIdIn(List<Long> requestIds);
    List<RequestWorkflowAssignment> findByRequestId(Long requestId);

    @Query("SELECT rwa, wf, rt, wla, wl FROM RequestWorkflowAssignment rwa " +
            "JOIN Workflow wf ON rwa.workflowId = wf.workflowId " +
            "JOIN RequestType rt ON rwa.requestId = rt.requestId " +
            "LEFT JOIN WorkflowLevelAssignment wla ON wla.assignment.id = rwa.id " +
            "LEFT JOIN WorkflowLevel wl ON wla.levelId = wl.id")
    List<Object[]> getWorkflowAssignments();
}