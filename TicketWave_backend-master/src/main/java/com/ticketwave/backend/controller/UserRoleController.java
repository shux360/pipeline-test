package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.role.Role;
import com.ticketwave.backend.repository.RoleRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class UserRoleController {
    @Autowired
    private RoleRepo roleRepo;

    @GetMapping("/roles")
    public ResponseEntity<List<String>> getAllRoles() {
        try {
            List<String> roles = roleRepo.findAll().stream()
                    .map(Role::getRoleName)
                    .filter(designation -> designation != null && !designation.trim().isEmpty())
                    .distinct()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
    }
    @PostMapping("/roles")
    public ResponseEntity<String> addRole(@RequestBody Role role) {
        try {
            // Validate the role name
            if (role.getRoleName() == null || role.getRoleName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Role name is required");
            }

            // Check if the role already exists
            Optional<Role> existingRole = roleRepo.findByRoleName(role.getRoleName());
            if (existingRole != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Role already exists");
            }

            // Save the new role
            roleRepo.save(role);
            return ResponseEntity.status(HttpStatus.CREATED).body("Role added successfully");
        } catch (Exception e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to add role");
        }
    }
}