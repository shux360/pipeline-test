package com.ticketwave.backend.controller;

import com.ticketwave.backend.exception.ResourceNotFoundException;
import com.ticketwave.backend.model.request.RequestType;
import com.ticketwave.backend.model.request.RequestTypeDTO;
import com.ticketwave.backend.repository.RequestTypeRepository;
import com.ticketwave.backend.service.RequestTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/requests")
public class RequestTypeController {

    private final RequestTypeService requestTypeService;

    @Autowired
    private RequestTypeRepository requestTypeRepository;

    public RequestTypeController(RequestTypeService requestTypeService) {
        this.requestTypeService = requestTypeService;
    }

    @PostMapping("/create-request")
    public ResponseEntity<RequestType> createRequestType(@RequestBody RequestTypeDTO requestTypeDTO) {
        RequestType savedRequestType = requestTypeService.saveRequestType(requestTypeDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRequestType);
    }

//     @GetMapping("/all")
//     public List<RequestType> getAllRequests() {
//         return requestTypeService.getAllRequests();
//     }
    @GetMapping("/all")
    public ResponseEntity<Iterable<RequestType>> getAllRequestTypes() {
        Iterable<RequestType> requestTypes = requestTypeService.getAllRequestTypes();
        return ResponseEntity.ok(requestTypes);
    }
//    @GetMapping("/{requestId}")
//    public ResponseEntity<RequestType> getWorkflowDetails(@PathVariable Long requestId) {
//        RequestType requestType = requestTypeService.getRequestDetails(requestId);
//        return ResponseEntity.ok(requestType);
//    }
    @GetMapping("/{requestId}")
    public ResponseEntity<?> getRequestTypeById(@PathVariable Long requestId) {
        try {
            RequestType requestType = requestTypeRepository.findById(requestId)
                    .orElseThrow(() -> new ResourceNotFoundException("RequestType not found for requestId: " + requestId));
            return ResponseEntity.ok(requestType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching request type: " + e.getMessage());
        }
    }

//    @PutMapping("/{requestId}")
//    public ResponseEntity<?> updateRequestType(@PathVariable Long requestId, @RequestBody RequestType updatedRequestType) {
//        try {
//            RequestType existingRequestType = requestTypeRepository.findById(requestId)
//                    .orElseThrow(() -> new ResourceNotFoundException("RequestType not found for requestId: " + requestId));
//
//            // Update request type fields
//            existingRequestType.setRequestCategory(updatedRequestType.getRequestCategory());
//            existingRequestType.setPriority(updatedRequestType.getPriority());
//            existingRequestType.setRequestName(updatedRequestType.getRequestName());
//            existingRequestType.setRequestCode(updatedRequestType.getRequestCode());
//            existingRequestType.setAttachmentsAllowed(updatedRequestType.getAttachmentsAllowed());
//            existingRequestType.setRole(updatedRequestType.getRole());
//
//            RequestType savedRequestType = requestTypeRepository.save(existingRequestType);
//            return ResponseEntity.ok(savedRequestType);
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating request type: " + e.getMessage());
//        }
//    }
    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateRequestType(@PathVariable Long requestId, @RequestBody RequestType updatedRequestType) {
        try {
            // Fetch the existing request type
            RequestType existingRequestType = requestTypeRepository.findById(requestId)
                    .orElseThrow(() -> new ResourceNotFoundException("RequestType not found for requestId: " + requestId));

            // Update the fields
            existingRequestType.setRequestCategory(updatedRequestType.getRequestCategory());
            existingRequestType.setPriority(updatedRequestType.getPriority());
            existingRequestType.setRequestName(updatedRequestType.getRequestName());
            existingRequestType.setRequestCode(updatedRequestType.getRequestCode());
            existingRequestType.setAttachmentsAllowed(updatedRequestType.getAttachmentsAllowed());
            existingRequestType.setRoles(updatedRequestType.getRoles());

            // Save the updated request type
            RequestType savedRequestType = requestTypeRepository.save(existingRequestType);
            return ResponseEntity.ok(savedRequestType);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating request type: " + e.getMessage());
        }

    }

    @GetMapping("/by-role")
    public ResponseEntity<?> getRequestTypesByRole(@RequestParam String role) {
        try {
            System.out.println("Role: " + role);
            Map<String, List<RequestType>> categorizedRequests = requestTypeService.getRequestTypesByRole(role);
            return ResponseEntity.ok(categorizedRequests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching request types: " + e.getMessage());
        }
    }


}
