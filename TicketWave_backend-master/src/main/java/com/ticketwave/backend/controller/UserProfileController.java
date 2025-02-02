package com.ticketwave.backend.controller;
//import com.ticketwave.backend.model.notification.Notification;
import com.ticketwave.backend.model.notification.Notifications;
import com.ticketwave.backend.model.user.*;
import com.ticketwave.backend.model.notification.NotificationType;
//import com.ticketwave.backend.repository.NotificationRepository;
import com.ticketwave.backend.repository.NotificationsRepository;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.UserActivitiesRepository;
import com.ticketwave.backend.repository.UserProfileRepo;
import com.ticketwave.backend.service.NotificationService;
import com.ticketwave.backend.service.UserProfileService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private UserAccountRepo userAccountRepository;

    @Autowired
    private UserProfileRepo userProfileRepository;

    @Autowired
    private UserActivitiesRepository userActivitiesRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationsRepository notificationRepository;

    @PostMapping("/create")
    public ResponseEntity<UserProfile> createProfile(@RequestBody UserProfile userProfile) {
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();
        UserAccount userAccount = userAccountRepository.findByUsername(username);

        if (userAccount != null) {
            userProfile.setUserId(userAccount.getUserId());
            userProfile.setCreatedBy(userAccount.getUserId());
            UserProfile createdProfile = userProfileService.createUserProfile(userProfile);
            return ResponseEntity.ok(createdProfile);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user-profile/{userId}")
    public ResponseEntity<UserAccountDTO> getUserProfile(@PathVariable int userId) {
        try {
            UserAccountDTO userAccDTO = userProfileService.getUserDetailsById(userId);
            return ResponseEntity.ok(userAccDTO);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{userId}/approve")
    public ResponseEntity<Void> approveUser(@PathVariable int userId,@RequestParam Long notificationId) {
        try {
            System.out.println("Approving user with ID: " + userId);


            userProfileService.approveUser(userId);
            System.out.println("User approved successfully!");


            UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername = currentUser.getUsername();
            System.out.println("Current admin username: " + currentUsername);


            UserAccount currentUserAccount = userAccountRepository.findByUsername(currentUsername);
            if (currentUserAccount == null) {
                System.out.println("Admin account not found for username: " + currentUsername);
                return ResponseEntity.status(403).build();
            }
            Notifications notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new EntityNotFoundException("Notification not found"));

            String message = "User account creation approved for user ID: " + userId;
            notificationService.addNotificationDetails(
                    notificationId, // Same notificationId
                    currentUserAccount.getUserId(), // Super admin is the sender
                    notification.getNotificationDetails().get(0).getSenderUserId(), // Admin who created the user is the receiver
                    notification.getNotificationDetails().get(0).getRequestId(), // Same requestId
                    NotificationType.USERAPPROVED,
                    message
            );

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error approving user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }



    @PostMapping("/{userId}/reject")
    public ResponseEntity<Void> rejectUser(@PathVariable int userId, @RequestParam(required = false) String comment,@RequestParam Long notificationId) {
        try {
            if (comment == null || comment.trim().isEmpty()) {
                comment = "No reason provided";
            }
            Notifications notification = notificationRepository.findById(notificationId)
                    .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
            System.out.println("Rejecting user with ID: " + userId + ", Comment: " + comment);

            userProfileService.rejectUser(userId, comment);
            System.out.println("User rejected successfully!");

            UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String currentUsername = currentUser.getUsername();
            System.out.println("Current admin username: " + currentUsername);

            UserAccount currentUserAccount = userAccountRepository.findByUsername(currentUsername);
            if (currentUserAccount == null) {
                System.out.println("Admin account not found for username: " + currentUsername);
                return ResponseEntity.status(403).build();
            }

            String message = "User account creation rejected for user ID: " + userId + ". Reason: " + comment;
            notificationService.addNotificationDetails(
                    notificationId, // Same notificationId
                    currentUserAccount.getUserId(), // Super admin is the sender
                    notification.getNotificationDetails().get(0).getSenderUserId(), // Admin who created the user is the receiver
                    notification.getNotificationDetails().get(0).getRequestId(), // Same requestId
                    NotificationType.USERREJECTED,
                    message
            );

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.err.println("Error rejecting user: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }
    
    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        try {
            long userCount = userAccountRepository.count();
            System.out.println("User Count: " + userCount); // Log the user count
            return ResponseEntity.ok(userCount);
        } catch (Exception e) {
            System.err.println("Error fetching user count: " + e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
    
    @PostMapping("{userId}/upload-image")
    public ResponseEntity<UserProfile> uploadProfileImage(@PathVariable int userId, @RequestParam("image") MultipartFile file) {
        try {
            byte[] imageData = file.getBytes();
            UserProfile updatedProfile = userProfileService.uploadProfileImage(userId, imageData);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user-details/{username}")
    public ResponseEntity<UserAccountDTO> getUserDetailsByUsername(@PathVariable String username) {
        try {
            UserAccount userAccount = userAccountRepository.findByUsername(username);
            if (userAccount == null) {
                return ResponseEntity.notFound().build();
            }

            UserProfile userProfile = userProfileRepository.findById(userAccount.getUserId())
                    .orElseThrow(() -> new EntityNotFoundException("User profile not found"));


            

            UserAccountDTO userAccountDTO = new UserAccountDTO();
            userAccountDTO.setUserId(userAccount.getUserId());
            userAccountDTO.setUsername(userAccount.getUsername());
            userAccountDTO.setName(userProfile.getName());
            userAccountDTO.setEmail(userProfile.getEmail());
            userAccountDTO.setDesignation(userProfile.getDesignation());
            userAccountDTO.setGrade(userProfile.getGrade());
            userAccountDTO.setJoinedDate(userProfile.getJoinedDate());
            userAccountDTO.setBranchId(userProfile.getBranchId());
            userAccountDTO.setDepartmentId(userProfile.getDepartmentId());
            userAccountDTO.setNextReportingPerson(userProfile.getNextReportingPerson());
            userAccountDTO.setUserPhoneNumber(userProfile.getUserPhoneNumber());
            userAccountDTO.setMaritalStatus(userProfile.getMaritalStatus());
            userAccountDTO.setAddress(userProfile.getAddress());
            userAccountDTO.setCreatedBy(userProfile.getCreatedBy());

            // Fetch last login time from user activities
            UserActivities userActivities = userActivitiesRepository.findById(userAccount.getUserId())
                    .orElse(new UserActivities());
            userActivities.setLastLoginTime(userActivities.getLastLoginTime());

            return ResponseEntity.ok(userAccountDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/user-profiles")
    public ResponseEntity<List<UserAccountDTO>> getAllUserProfiles() {
        try {
            List<UserAccountDTO> userProfiles = userProfileService.getAllUserProfiles();
            return ResponseEntity.ok(userProfiles);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    @PostMapping("/update_user/{userId}")
    public ResponseEntity<UserAccount> updateUserProfile(
            @PathVariable int userId,
            @RequestBody UserAccountDTO updatedUser
    ) {
        try {
            UserAccount updatedAccount = userProfileService.updateUserProfile(userId, updatedUser);
            return ResponseEntity.ok(updatedAccount);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
    @GetMapping("/user-ids-and-names")
    public ResponseEntity<?> getAllUserIdsAndNames() {
        try {
            List<UserIdNameDTO> userIdsAndNames = userProfileService.getAllUserIdsAndNames();
            return ResponseEntity.ok(userIdsAndNames);
        }  catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
    //get userid and name by id
    @GetMapping("/user-id-name/{userId}")
    public ResponseEntity<?> getUserIdAndNameById(@PathVariable int userId) {
        try {
            UserIdNameDTO userIdName = userProfileService.getUserIdAndNameById(userId);
            return ResponseEntity.ok(userIdName);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get users by designation
    @GetMapping("/users-by-designation/{designation}")
    public ResponseEntity<?> getUsersByDesignation(@PathVariable String designation) {
        try {
            List<UserIdNameDTO> users = userProfileService.getUsersByDesignation(designation);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    //get users by grade
    @GetMapping("/users-by-grade/{grade}")
    public ResponseEntity<?> getUsersByGrade(@PathVariable String grade) {
        try {
            List<UserIdNameDTO> users = userProfileService.getUsersByGrade(grade);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

}
