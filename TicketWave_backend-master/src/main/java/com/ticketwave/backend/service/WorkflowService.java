package com.ticketwave.backend.service;

import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserPrincipal;
import com.ticketwave.backend.model.workflow.Workflow;
import com.ticketwave.backend.model.workflow.WorkflowDTO;
import com.ticketwave.backend.model.workflow.WorkflowLevel;
import com.ticketwave.backend.model.workflow.WorkflowLevelDTO;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.WorkflowLevelRepo;
import com.ticketwave.backend.repository.WorkflowRepo;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class WorkflowService {
    @Autowired
    private WorkflowRepo workflowRepo;

    @Autowired
    private WorkflowLevelRepo workflowLevelRepo;

    @Autowired
    private UserAccountRepo userAccountRepository;

    @Autowired
    private CurrentUser currentUser;

    public Workflow createWorkflow(Workflow workflow) {
        CurrentUser currentUser = new CurrentUser();
        UserAccount userAccnt = currentUser.getCurrentUser();
//        // Get the currently authenticated user
//        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String username = userPrincipal.getUsername();
//
//        // Find the corresponding user account
//        UserAccount userAccnt = userAccountRepository.findByUsername(username);

        // Set the logged-in user's userId as the creator of the workflow
        workflow.setWorkflowCreatedBy(userAccnt.getUserId());

        // Optionally, set the created date to the current date/time
        workflow.setWorkflowCreatedDate(java.time.LocalDateTime.now().toString());

        // Save the workflow
        return workflowRepo.save(workflow);
    }





    public Workflow getWorkflowDetails(Long workflowId) {
        Workflow workflow = workflowRepo.findById(workflowId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found"));
        return workflow;
//        return new WorkflowDTO(
//                workflow.getWorkflowName(),
//                workflow.getWorkflowDescription(),
//                workflow.getNoOfWorkflowLevel(),
//                workflow.getWorkflowType(),
//                workflow.getIdentificationString()
//        );
    }

    public List<Workflow>getAllWorkflows() {

        return workflowRepo.findAll();
    }

    @Transactional
    public Workflow saveWorkflowStep1(WorkflowDTO workflowDTO) {
        UserAccount userAccnt = currentUser.getCurrentUser();

        Workflow workflow = new Workflow();
        workflow.setWorkflowName(workflowDTO.getWorkflowName());
        workflow.setWorkflowDescription(workflowDTO.getWorkflowDescription());
        workflow.setNoOfWorkflowLevel(workflowDTO.getNoOfWorkflowLevel());
        workflow.setWorkflowType(workflowDTO.getWorkflowType());

        workflow.setWorkflowCreatedDate(java.time.LocalDateTime.now().toString());
        workflow.setWorkflowCreatedBy(userAccnt.getUserId());
        return workflowRepo.save(workflow);
    }

    public String generateWorkflowIdentificationString(List<WorkflowLevel> workflowLevels) {
        return workflowLevels.stream()
                .map(WorkflowLevel::getAuthPerson)
                .collect(Collectors.joining(">"));
    }

    @Transactional
    public Workflow saveWorkflowStep2(Long workflowId, List<WorkflowLevelDTO> workflowLevelDTOs) {
        Workflow workflow = workflowRepo.findById(workflowId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found"));

        List<WorkflowLevel> levels = workflowLevelDTOs.stream().map(dto -> {
            WorkflowLevel level = new WorkflowLevel();
            level.setApprovalLevel(dto.getApprovalLevel());
            level.setLevelType(dto.getLevelType());
            level.setAuthPerson(dto.getAuthPerson());
            level.setAllowBypass(dto.isAllowBypass());
            level.setAllowRevert(dto.isAllowRevert());
            level.setWorkflow(workflow);
            return level;
        }).toList();

        String workflowIdentificationString = generateWorkflowIdentificationString(levels);
        workflow.setIdentificationString(workflowIdentificationString);

        workflow.getWorkflowLevels().clear();
        workflow.getWorkflowLevels().addAll(levels);
        return workflowRepo.save(workflow);
    }


    @Transactional
    public Workflow editWorkflowStep2(Long workflowId, List<WorkflowLevel> workflowLevels) {
        Workflow workflow = workflowRepo.findById(workflowId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found"));

        // Retrieve existing workflow levels
        List<WorkflowLevel> existingLevels = workflow.getWorkflowLevels();

        // Map DTOs to entities and handle create/update logic
        List<WorkflowLevel> updatedLevels = workflowLevels.stream().map(dto -> {
            WorkflowLevel level;

            // If DTO contains an ID, update the existing level
            if (dto.getId() != null) {
                level = existingLevels.stream()
                        .filter(existingLevel -> existingLevel.getId().equals(dto.getId()))
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("Workflow Level not found"));

                // Update the existing level's fields
                level.setApprovalLevel(dto.getApprovalLevel());
                level.setLevelType(dto.getLevelType());
                level.setAuthPerson(dto.getAuthPerson());
                level.setAllowBypass(dto.isAllowBypass());
                level.setAllowRevert(dto.isAllowRevert());
            } else {
                // Otherwise, create a new level
                level = new WorkflowLevel();
                level.setApprovalLevel(dto.getApprovalLevel());
                level.setLevelType(dto.getLevelType());
                level.setAuthPerson(dto.getAuthPerson());
                level.setAllowBypass(dto.isAllowBypass());
                level.setAllowRevert(dto.isAllowRevert());
                level.setWorkflow(workflow); // Link new level to the workflow
            }
            return level;
        }).toList();

        // Handle removal of levels that are not in the updated DTO list
        List<Long> updatedLevelIds = workflowLevels.stream()
                .map(WorkflowLevel::getId)
                .filter(Objects::nonNull)
                .toList();

        existingLevels.removeIf(existingLevel ->
                !updatedLevelIds.contains(existingLevel.getId()));

        // Set updated levels in the workflow
        workflow.getWorkflowLevels().clear();
        workflow.getWorkflowLevels().addAll(updatedLevels);

        // Generate and set the workflow identification string
        String workflowIdentificationString = generateWorkflowIdentificationString(updatedLevels);
        workflow.setIdentificationString(workflowIdentificationString);

        return workflowRepo.save(workflow);
    }


    public Workflow getWorkflowById(Long workflowId) {
        return workflowRepo.findById(workflowId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found"));
    }

    public Workflow editWorkflow(Long workflowId, WorkflowDTO workflowDTO) {
        Workflow workflow = workflowRepo.findById(workflowId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow not found"));

        workflow.setWorkflowName(workflowDTO.getWorkflowName());
        workflow.setWorkflowDescription(workflowDTO.getWorkflowDescription());
        workflow.setNoOfWorkflowLevel(workflowDTO.getNoOfWorkflowLevel());
        workflow.setWorkflowType(workflowDTO.getWorkflowType());

        workflow.setWorkflowUpdatedDate(LocalDateTime.now().toString());

        return workflowRepo.save(workflow);
    }

    //edit an existing workflow level
    public WorkflowLevel editWorkflowLevels(Long workflowLevelId, WorkflowLevelDTO workflowLevelDTO) {
        WorkflowLevel workflowLevel = workflowLevelRepo.findById(workflowLevelId)
                .orElseThrow(() -> new EntityNotFoundException("Workflow Level not found"));

        workflowLevel.setApprovalLevel(workflowLevelDTO.getApprovalLevel());
        workflowLevel.setLevelType(workflowLevelDTO.getLevelType());
        workflowLevel.setAuthPerson(workflowLevelDTO.getAuthPerson());
        workflowLevel.setAllowBypass(workflowLevelDTO.isAllowBypass());
        workflowLevel.setAllowRevert(workflowLevelDTO.isAllowRevert());

        return workflowLevelRepo.save(workflowLevel);
    }

    public List<Workflow> findWorkflowsByRequestId(Long requestId) {
        return workflowRepo.findWorkflowsByRequestId(requestId);
    }


}
