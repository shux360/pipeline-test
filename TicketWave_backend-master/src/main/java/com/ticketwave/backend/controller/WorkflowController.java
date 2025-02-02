package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.workflow.Workflow;
import com.ticketwave.backend.model.workflow.WorkflowDTO;
import com.ticketwave.backend.model.workflow.WorkflowLevel;
import com.ticketwave.backend.model.workflow.WorkflowLevelDTO;
import com.ticketwave.backend.service.WorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/workflows")
public class WorkflowController {

    @Autowired
    private WorkflowService workflowService;

    @PostMapping("/create_workflow")
    public Workflow createWorkflow(@RequestBody Workflow workflow) {
        return workflowService.createWorkflow(workflow);
    }

    @GetMapping("/all")
    public List<Workflow> getAllWorkflows() {
        return workflowService.getAllWorkflows();
    }

    @GetMapping("/{workflowId}")
    public ResponseEntity<Workflow> getWorkflowDetails(@PathVariable Long workflowId) {
        Workflow workflow = workflowService.getWorkflowDetails(workflowId);
        return ResponseEntity.ok(workflow);
    }

    @PostMapping("/step1")
    public ResponseEntity<Workflow> saveWorkflowStep1(@RequestBody WorkflowDTO workflowDTO) {
        Workflow workflow = workflowService.saveWorkflowStep1(workflowDTO);
        return ResponseEntity.ok(workflow);
    }
//    @GetMapping("/{workflowId}")
//    public ResponseEntity<Workflow> getWorkflowById(@PathVariable Long workflowId) {
//        Workflow workflow = workflowService.getWorkflowById(workflowId);
//        return ResponseEntity.ok(workflow);
//    }
    @PostMapping("/step2/{workflowId}")
    public ResponseEntity<Workflow> createWorkflowStep2(@PathVariable Long workflowId,
                                                        @RequestBody List<WorkflowLevelDTO> workflowLevelDTOs) {
        Workflow workflow = workflowService.saveWorkflowStep2(workflowId, workflowLevelDTOs);
        return ResponseEntity.ok(workflow);
    }

    @PutMapping("/editWorkflowLevel/{workflowId}")
    public ResponseEntity<Workflow> editWorkflowStep2(@PathVariable Long workflowId,
                                                        @RequestBody List<WorkflowLevel> workflowLevels) {
        Workflow workflow = workflowService.editWorkflowStep2(workflowId, workflowLevels);
        return ResponseEntity.ok(workflow);
    }

    @PutMapping("/editWorkflow/{workflowId}")
    public ResponseEntity<Workflow> editWorkflow(@PathVariable Long workflowId, @RequestBody WorkflowDTO workflowDTO) {
        Workflow updatedWorkflow = workflowService.editWorkflow(workflowId, workflowDTO);
        return ResponseEntity.ok(updatedWorkflow);
    }


    @GetMapping("/by-request/{requestId}")
    public List<Workflow> getWorkflowsByRequestId(@PathVariable Long requestId) {
        return workflowService.findWorkflowsByRequestId(requestId);
    }
}
