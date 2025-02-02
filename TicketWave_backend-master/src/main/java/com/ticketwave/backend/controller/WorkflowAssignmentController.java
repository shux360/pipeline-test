package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.workflow.workflowAssignment.RequestWorkflowAssignment;
import com.ticketwave.backend.model.workflow.workflowAssignment.UpdateEscalatingTimesRequest;
import com.ticketwave.backend.model.workflow.workflowAssignment.WorkflowAssignmentRequest;
import com.ticketwave.backend.service.WorkflowAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workflows")

public class WorkflowAssignmentController {

    @Autowired
    private WorkflowAssignmentService workflowAssignmentService;

//    private final WorkflowAssignmentService workflowAssignmentService;

    @Autowired
    public WorkflowAssignmentController(
            WorkflowAssignmentService workflowAssignmentService
    ) {
        this.workflowAssignmentService = workflowAssignmentService;
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignWorkflows(
            @RequestBody WorkflowAssignmentRequest request
    ) {
        try {
            workflowAssignmentService.assignWorkflows(request);
            return ResponseEntity.ok("Workflows assigned successfully");
        } catch (Exception e) {
            System.out.println("Error assigning workflows:");
//            log.error("Error assigning workflows: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error assigning workflows");
        }
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Map<String, Object>>> getWorkflowAssignments() {
        List<Map<String, Object>> assignments = workflowAssignmentService.getWorkflowAssignments();
        return ResponseEntity.ok(assignments);
    }

    @PutMapping("/assignments/update-escalating-times")
    public ResponseEntity<String> updateEscalatingTimes(
            @RequestBody UpdateEscalatingTimesRequest request
    ) {
        try {
            workflowAssignmentService.updateEscalatingTimes(request);
            return ResponseEntity.ok("Escalating times updated successfully");
        } catch (Exception e) {
            System.out.println("Error updating escalating times: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating escalating times");
        }
    }

    //delete workflow assignment
    @DeleteMapping("/assignments/delete-level-assignment")
    public ResponseEntity<String> deleteWorkflowAssignment(@RequestBody Map<String, Long> request) {
        try {
            Long id = request.get("id");
            workflowAssignmentService.deleteWorkflowAssignment(id);
            return ResponseEntity.ok("Workflow assignment deleted successfully");
        } catch (Exception e) {
            System.out.println("Error deleting workflow assignment: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting workflow assignment");
        }
    }

//    @GetMapping("/by-request/{requestId}")
//    public List<RequestWorkflowAssignment> getWorkflowsByRequestId(@PathVariable Long requestId) {
//        return workflowAssignmentService.getWorkflowsByRequestId(requestId);
//    }
}