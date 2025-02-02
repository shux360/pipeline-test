package com.ticketwave.backend.service;

import com.ticketwave.backend.model.request.RequestType;
import com.ticketwave.backend.model.workflow.Workflow;
import com.ticketwave.backend.model.workflow.WorkflowLevel;
import com.ticketwave.backend.model.workflow.workflowAssignment.*;
import com.ticketwave.backend.repository.RequestTypeRepository;
import com.ticketwave.backend.repository.RequestWorkflowAssignmentRepository;
import com.ticketwave.backend.repository.WorkflowLevelAssignmentRepository;
import com.ticketwave.backend.repository.WorkflowRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class WorkflowAssignmentService {

    private final RequestWorkflowAssignmentRepository assignmentRepository;
    private final WorkflowLevelAssignmentRepository levelAssignmentRepository;
    private final WorkflowService workflowService;
    @Autowired
    private RequestTypeRepository RequestTypeRepository;



    @Autowired
    private WorkflowRepo workflowRepo;

    @Autowired
    public WorkflowAssignmentService(
            RequestWorkflowAssignmentRepository assignmentRepository,
            WorkflowLevelAssignmentRepository levelAssignmentRepository,
            WorkflowService workflowService, WorkflowRepo workflowRepo) {
        this.assignmentRepository = assignmentRepository;
        this.levelAssignmentRepository = levelAssignmentRepository;
        this.workflowService = workflowService;
        this.workflowRepo = workflowRepo;
    }

    public void assignWorkflows(WorkflowAssignmentRequest request) {
        List<RequestWorkflowAssignment> assignments = new ArrayList<>();

        for (Long requestId : request.getRequestIds()) {
            for (WorkflowWithLevels workflow : request.getWorkflows()) {
                RequestWorkflowAssignment assignment = new RequestWorkflowAssignment();
                assignment.setRequestId(requestId);
                assignment.setWorkflowId(workflow.getWorkflowId());
                assignment.setAssignedDate(LocalDateTime.now());

                List<WorkflowLevelAssignment> levelAssignments =
                        workflow.getWorkflowLevels().stream()
                                .map(level -> {
                                    WorkflowLevelAssignment levelAssignment =
                                            new WorkflowLevelAssignment();
                                    levelAssignment.setAssignment(assignment);
                                    levelAssignment.setLevelId(level.getId());
                                    levelAssignment.setEscalatingTime(
                                            level.getEscalatingTime());
                                    return levelAssignment;
                                })
                                .collect(Collectors.toList());

                assignment.setLevelAssignments(levelAssignments);
                assignments.add(assignment);
            }
        }


        assignmentRepository.saveAll(assignments);
    }


    public List<Map<String, Object>> getWorkflowAssignments() {
        List<Object[]> assignments = assignmentRepository.getWorkflowAssignments();

        Map<Long, Map<String, Object>> result = new HashMap<>();

        for (Object[] record : assignments) {
            RequestWorkflowAssignment rwa = (RequestWorkflowAssignment) record[0];
            Workflow workflow = (Workflow) record[1];
            RequestType requestType = (RequestType) record[2];
            WorkflowLevelAssignment levelAssignment = (WorkflowLevelAssignment) record[3];
            WorkflowLevel workflowLevel = (WorkflowLevel) record[4];

            // Build the main map for each workflow assignment
            result.computeIfAbsent(rwa.getId(), key -> {
                Map<String, Object> map = new HashMap<>();
                map.put("workflowId", workflow.getWorkflowId());
                map.put("workflowIdentificationString", workflow.getIdentificationString());
                map.put("requestTypes", new ArrayList<>(Collections.singletonList(requestType.getRequestName())));

                List<String> roleNames = new ArrayList<>();
                if (requestType.getRoles() != null && !requestType.getRoles().isEmpty()) {
                    roleNames = requestType.getRoles().stream()
                            .map(role -> role.getRoleName()) // Replace getRoleName() with the actual method to get the role name
                            .collect(Collectors.toList());
                }

                map.put("jobCategories", new ArrayList<>(roleNames));
                map.put("levelAssignments", new ArrayList<Map<String, Object>>());
                return map;
            });

            // Add level assignments to the corresponding assignment map
            if (levelAssignment != null && workflowLevel != null) {
                Map<String, Object> levelMap = new HashMap<>();
                levelMap.put("workflowAssignmentId", rwa.getId());
                levelMap.put("levelAssignmentId", levelAssignment.getId());
                levelMap.put("levelId", levelAssignment.getLevelId());
                levelMap.put("escalatingTime", levelAssignment.getEscalatingTime());
                levelMap.put("authPerson", workflowLevel.getAuthPerson());
                levelMap.put("approvalLevel", workflowLevel.getApprovalLevel());

                ((List<Map<String, Object>>) result.get(rwa.getId()).get("levelAssignments")).add(levelMap);
            }
        }

        return new ArrayList<>(result.values());
    }

    public void updateEscalatingTimes(UpdateEscalatingTimesRequest request) {
        for (WorkflowLevelDTO levelAssignmentDTO : request.getLevelAssignments()) {

            WorkflowLevelAssignment levelAssignment = levelAssignmentRepository
                    .findById(levelAssignmentDTO.getId())
                    .orElseThrow(() -> new RuntimeException("Level assignment not found"));

            levelAssignment.setEscalatingTime(levelAssignmentDTO.getEscalatingTime());
            levelAssignmentRepository.save(levelAssignment);
        }
    }

    public void deleteWorkflowAssignment(Long id) {
        RequestWorkflowAssignment assignment = assignmentRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow assignment not found"));
        assignmentRepository.deleteById(id);

    }

//    public List<RequestWorkflowAssignment> getWorkflowsByRequestId(Long requestId) {
//        return requestWorkflowAssignmentRepository.findByRequestId(requestId);
//    }
}