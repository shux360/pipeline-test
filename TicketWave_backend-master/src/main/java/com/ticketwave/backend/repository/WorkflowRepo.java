package com.ticketwave.backend.repository;
import com.ticketwave.backend.model.workflow.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WorkflowRepo extends JpaRepository<Workflow, Long> {
    Workflow findByWorkflowName(String workflowName);

    @Query("SELECT w FROM Workflow w " +
            "JOIN RequestWorkflowAssignment rwa ON w.workflowId = rwa.workflowId " +
            "WHERE rwa.requestId = :requestId")
    List<Workflow> findWorkflowsByRequestId(@Param("requestId") Long requestId);
}
