package com.ticketwave.backend.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ticketwave.backend.exception.ResourceNotFoundException;
import com.ticketwave.backend.model.form.FormDTO;
import com.ticketwave.backend.model.form.FormDetail;
import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserAccountDTO;
import com.ticketwave.backend.model.user.UserProfile;
import com.ticketwave.backend.repository.FormDetailRepo;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.UserProfileRepo;
import com.ticketwave.backend.service.FormService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/forms")
public class FormController {

    @Autowired
    private FormDetailRepo formDetailRepository;

    @Autowired
    private FormService service;
    @Autowired
    private UserAccountRepo userAccountRepo;
    @Autowired
    private UserProfileRepo userProfileRepo;

    @PostMapping("/save")
    public ResponseEntity<?> saveForm(@RequestBody FormDTO formDTO) {
        try{
            FormDetail savedForm = service.saveForm(formDTO);
            return ResponseEntity.ok(savedForm);
        } catch (Exception e) {
            System.out.println("Error saving form: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving form: " + e.getMessage());
        }

    }
    @GetMapping("/{requestId}")
    public ResponseEntity<FormDTO> getFormDetailByRequestId(@PathVariable Long requestId) {
        Optional<FormDTO> formDTO = service.getFormDetailByRequestId(requestId);
        return formDTO.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{requestId}")
    public ResponseEntity<?> updateForm(@PathVariable Long requestId, @RequestBody FormDTO updatedForm) {
        System.out.println("Request ID: " + requestId+ " Updated Form: " + updatedForm);
        try {
            FormDetail savedForm = service.updateForm(updatedForm);



//            // Fetch the existing form
//            FormDetail existingForm = formDetailRepository.findByRequestId(requestId)
//                    .orElseThrow(() -> new ResourceNotFoundException("Form not found for requestId: " + requestId));
//
//            // Update the form elements
//
//            existingForm.setElements(updatedForm.getElements());
//
//            updatedForm.getElements().forEach(element -> {
//                element.setFormDetail(existingForm);
//            });
//
//            existingForm.setUpdatedAt(LocalDateTime.now());
//            System.out.println("Updated Form: " + existingForm);
//
//            // Save the updated form
//            FormDetail savedForm = formDetailRepository.save(existingForm);
            return ResponseEntity.ok(savedForm);
        } catch (Exception e) {
            System.out.println("Error updating form: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating form: " + e.getMessage());

        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            // Fetch all users from the database
            List<UserProfile> users = userProfileRepo.findAll();

            // Map users to a simplified DTO (if needed) or return the full user objects
            List<UserAccountDTO> userDTOs = users.stream()
                    .map(user -> new UserAccountDTO(user.getUserId(),user.getName()))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            System.out.println("Error fetching users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching users: " + e.getMessage());
        }
    }

}
