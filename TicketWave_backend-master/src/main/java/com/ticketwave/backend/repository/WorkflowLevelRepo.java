package com.ticketwave.backend.repository;
import com.ticketwave.backend.model.workflow.WorkflowLevel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkflowLevelRepo extends JpaRepository<WorkflowLevel, Long> {


}
