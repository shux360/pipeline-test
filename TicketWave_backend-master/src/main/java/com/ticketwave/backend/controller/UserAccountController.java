package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.role.Role;
import com.ticketwave.backend.model.user.*;
import com.ticketwave.backend.repository.DeletedUserRepo;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.UserActivitiesRepository;
import com.ticketwave.backend.repository.UserProfileRepo;
import com.ticketwave.backend.service.UserAccountService;
import com.ticketwave.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@RestController
public class UserAccountController {

    @Autowired
    private UserAccountService userAccountService;
    @Autowired
    private UserAccountRepo userAccountRepo;

    @Autowired
    private DeletedUserRepo deletedUserRepo;


    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserProfileRepo userProfileRepo;


    @Autowired
    private UserActivitiesRepository userActivitiesRepository;

    @PostMapping("/signup")
    public ResponseEntity<UserAccount> createSuperAdmin(@RequestBody UserAccount userAccount) {
        UserAccount createdSuperAdmin = userAccountService.createSuperAdmin(userAccount);
        return new ResponseEntity<>(createdSuperAdmin, HttpStatus.CREATED);
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody UserAccount loginRequest) {
//        System.out.println("Login request: " + loginRequest);
//        // Find the user by userId
//        UserAccount user = userAccountRepo.findByUsername(loginRequest.getUsername());
//
//        // Check if user is null and handle it
//        if (user == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
//        }
//
//        // Authenticate using the username associated with the found user
//        Authentication authentication = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
//        );
//
//        if (authentication.isAuthenticated()) {
//            // Generate JWT token
//            String token = jwtService.generateToken(user.getUsername());
//
//            // Create a JSON response with the token
//            Map<String, Object> response = new HashMap<>();
//            response.put("token", token);
//
//            // You can include specific user details, or the whole user object if needed
//            Map<String, Object> userDetails = new HashMap<>();
//            userDetails.put("userProfile", user.getUserProfile());
//            userDetails.put("username", user.getUsername());
//            userDetails.put("passwordResetFirstTime", user.isPasswordReset());
//            userDetails.put("roles", user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()));
//            response.put("user", userDetails);
//
//            boolean passwordResetValue = user.isPasswordReset();
//            response.put("passwordReset", passwordResetValue);
//
//            if (user.isPasswordReset()) {
//                System.out.println("Password reset is required for user: " + user.getUsername());
//
//
//            } else {
//                System.out.println("Password reset is not required for user: " + user.getUsername());
//            }
//            return new ResponseEntity<>(response, HttpStatus.OK);
//
//        } else {
//            // Return failure message if authentication fails
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
//        }
//
//    }




    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserAccount loginRequest) {
        System.out.println("Login request: " + loginRequest);
        UserAccount user = userAccountRepo.findByUsername(loginRequest.getUsername());

        if (user == null) {
            System.out.println("User not found for username: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        System.out.println("Found user: " + user.getUsername() + " with userId: " + user.getUserId());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), loginRequest.getPassword())
        );

        if (authentication.isAuthenticated()) {
            String token = jwtService.generateToken(user.getUsername());
            System.out.println("Token generated for user: " + user.getUsername());

            // Update last login time
//            UserActivities userActivities = userActivitiesRepository.findById(user.getUserId()).orElse(new UserActivities());
            UserActivities userActivities = userActivitiesRepository.findById(user.getUserId()).orElse(new UserActivities());

            System.out.println("UserActivities object created or fetched: " + userActivities);

            userActivities.setUserId(user.getUserId());
            System.out.println("Set userId in UserActivities: " + user.getUserId());

            userActivities.setUsername(user.getUsername());
            System.out.println("Set username in UserActivities: " + user.getUsername());

            userActivities.setLastLoginTime(LocalDateTime.now());
            System.out.println("Set lastLoginTime in UserActivities: " + LocalDateTime.now());

            try {
                userActivitiesRepository.save(userActivities);
                System.out.println("UserActivities saved successfully for userId: " + user.getUserId());
            } catch (Exception e) {
                System.err.println("Error saving UserActivities: " + e.getMessage());
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving user activities");
            }

            // Sort roles: SUPER_ADMIN and ADMIN should be at the first index
            List<String> roles = user.getRoles().stream()
                    .map(Role::getRoleName)
                    .sorted((role1, role2) -> {
                        if (role1.equals("SUPER_ADMIN")) return -1; // SUPER_ADMIN comes first
                        if (role2.equals("SUPER_ADMIN")) return 1;
                        if (role1.equals("ADMIN")) return -1; // ADMIN comes next
                        if (role2.equals("ADMIN")) return 1;
                        return 0; // Other roles remain in their original order
                    })
                    .collect(Collectors.toList());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            Map<String, Object> userDetails = new HashMap<>();
            userDetails.put("userProfile", user.getUserProfile());
            userDetails.put("username", user.getUsername());
            userDetails.put("passwordResetFirstTime", user.isPasswordReset());
//            userDetails.put("roles", user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()));
            userDetails.put("roles", roles);
            response.put("user", userDetails);

            boolean passwordResetValue = user.isPasswordReset();
            response.put("passwordReset", passwordResetValue);

            if (user.isPasswordReset()) {
                System.out.println("Password reset is required for user: " + user.getUsername());
            } else {
                System.out.println("Password reset is not required for user: " + user.getUsername());
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            System.out.println("Authentication failed for user: " + user.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
    }


    // Reset the autogenerated password after login
    @PostMapping("/reset_password")
    public ResponseEntity<?> resetPasssword(@RequestBody String newPassword) {
        // Get the logged-in userName
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();
        UserAccount userAccount = userAccountRepo.findByUsername(username);

        userAccountService.resetPassword(username, newPassword);
        return ResponseEntity.ok("Password reset successful");
    }

    @GetMapping("/current_user")
    public ResponseEntity<?> getCurrentUser() {
        // Get the logged-in userName
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();
        UserAccount userAccount = userAccountRepo.findByUsername(username);

        List<String> roles = userAccount.getRoles().stream()
                .map(Role::getRoleName)
                .sorted((role1, role2) -> {
                    if (role1.equals("SUPER_ADMIN")) return -1; // SUPER_ADMIN comes first
                    if (role2.equals("SUPER_ADMIN")) return 1;
                    if (role1.equals("ADMIN")) return -1; // ADMIN comes next
                    if (role2.equals("ADMIN")) return 1;
                    return 0; // Other roles remain in their original order
                })
                .collect(Collectors.toList());

        // Create a JSON response with the user details
        Map<String, Object> response = new HashMap<>();
        response.put("username", userAccount.getUsername());
//        response.put("roles", userAccount.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()));
        response.put("roles", roles);
        response.put("userId", userAccount.getUserId());
        response.put("userProfile", userAccount.getUserProfile());
        return ResponseEntity.ok(response);
    }

    // Change user password
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> passwords) {

        String currentPassword = passwords.get("currentPassword");
        String newPassword = passwords.get("newPassword");

        // Get the logged-in user's username
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();

        // Authenticate the user with current password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, currentPassword)
        );

        if (authentication.isAuthenticated()) {
            // Call service to change the password
            userAccountService.resetPassword(username, newPassword);
            return ResponseEntity.ok("Password changed successfully");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Current password is incorrect");
        }

    }


    //below endpoints are dedicated for the users who forgot their pwd to change it.

    @PostMapping("/forgot-password")
    public ResponseEntity<?> generateResetToken(@RequestParam String username) {
        try {
            userAccountService.generateResetToken(username);
            return ResponseEntity.ok("Password reset link sent to your email");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/new-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            String newPassword = request.get("newPassword");

            System.out.println("Received token: " + token);
            System.out.println("Received newPassword: " + newPassword);

            userAccountService.newPassword(token, newPassword);
            return ResponseEntity.ok("Password reset successfully.");
        } catch (RuntimeException e) {
            System.err.println("Error resetting password: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/send-email/{userId}")
    public ResponseEntity<String> sendEmail(@PathVariable int userId) {
        try {
            // Fetch the user account
            UserAccount userAccount = userAccountRepo.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Send the email
            userAccountService.sendApprovalEmail(userAccount);

            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending email: " + e.getMessage());
        }
    }

    //get all users
    @GetMapping("/users")
    public List<UserAccount> getAllUsers() {
        return userAccountRepo.findAll();
    }

    //delete user
//    @DeleteMapping("/delete-user/{userId}")
//    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
//        try {
//            userAccountService.deleteUser(userId);
//            return ResponseEntity.ok("User deleted successfully");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());
//        }
//    }


    @DeleteMapping("/delete-user/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable int userId) {
        try {
            // Log the start of the deletion request
            System.out.println("Received request to delete user ID: " + userId);

            // Call the service to delete the user
            userAccountService.deleteUser(userId);

            // Log successful deletion
            System.out.println("User deletion completed successfully for user ID: " + userId);

            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            // Log any errors that occur
            System.err.println("Error deleting user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting user: " + e.getMessage());
        }
    }

//
//    @GetMapping("/deleted-users")
//    public ResponseEntity<List<DeletedUser>> getDeletedUsers() {
//        ResponseEntity<List<DeletedUser>> result;
//        try {
//            List<DeletedUser> deletedUsers = DeletedUserRepo.findAll();
//            result = ResponseEntity.ok(deletedUsers);
//        } catch (Exception e) {
//            result = ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//
//        }
//
//        return result;
//    }


    @GetMapping("/deleted-users")
    public ResponseEntity<List<DeletedUser>> getDeletedUsers() {
        try {
            List<DeletedUser> deletedUsers = deletedUserRepo.findAll(); // Use the instance variable
            return ResponseEntity.ok(deletedUsers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
