package com.ticketwave.backend.service;


import com.ticketwave.backend.model.request.RequestTypeDTO;
import com.ticketwave.backend.model.request.RequestType;
import com.ticketwave.backend.model.role.Role;
import com.ticketwave.backend.repository.RequestTypeRepository;
import com.ticketwave.backend.repository.RoleRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import java.util.stream.Collectors;



@Service
@RequiredArgsConstructor
public class RequestTypeService {

    private final RequestTypeRepository requestTypeRepository;
    private final RoleRepo roleRepository;

    public RequestType saveRequestType(RequestTypeDTO requestTypeDTO) {
        // Map RequestTypeDTO to RequestType
        RequestType requestType = new RequestType();
        requestType.setRequestName(requestTypeDTO.getRequestName());
        requestType.setRequestCode(requestTypeDTO.getRequestCode());
        requestType.setRequestCategory(requestTypeDTO.getRequestCategory());
        requestType.setPriority(requestTypeDTO.getPriority());
        requestType.setAttachmentsAllowed(requestTypeDTO.isAttachmentsAllowed());

        // Map roles from DTO to entity
        Set<Role> roles = new HashSet<>();
        for (String roleName : requestTypeDTO.getRoles()) {
            Role role = roleRepository.findByRoleName(roleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            roles.add(role);
        }
        requestType.setRoles(roles);

        // Save RequestType
        return requestTypeRepository.save(requestType);
    }

//     public List<RequestType>getAllRequests() {

//         return requestTypeRepository.findAll();
//     }
//     public RequestType getRequestDetails(Long requestId) {
//         RequestType requestType = requestTypeRepository.findById(requestId)
//                 .orElseThrow(() -> new EntityNotFoundException("Request type not found"));
//         return requestType;
// //        return new WorkflowDTO(
// //                workflow.getWorkflowName(),
// //                workflow.getWorkflowDescription(),
// //                workflow.getNoOfWorkflowLevel(),
// //                workflow.getWorkflowType(),
// //                workflow.getIdentificationString()
// //        );
//     }

    public Iterable<RequestType> getAllRequestTypes() {
        return requestTypeRepository.findAll();
    }


    public Map<String, List<RequestType>> getRequestTypesByRole(String role) {
        try {
            List<RequestType> requestTypes = requestTypeRepository.findByRole(role);
            return requestTypes.stream()
                    .collect(Collectors.groupingBy(RequestType::getRequestCategory));
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch and categorize request types: " + e.getMessage());
        }
    }

}