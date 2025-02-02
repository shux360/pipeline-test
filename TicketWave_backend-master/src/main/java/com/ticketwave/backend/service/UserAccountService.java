//package com.ticketwave.backend.service;
//
//import com.ticketwave.backend.model.role.Role;
//import com.ticketwave.backend.model.user.UserAccount;
//import com.ticketwave.backend.model.user.UserAccountDTO;
//import com.ticketwave.backend.model.user.UserPrincipal;
//import com.ticketwave.backend.model.user.UserProfile;
//import com.ticketwave.backend.repository.RoleRepository;
//import com.ticketwave.backend.repository.UserAccountRepo;
//import com.ticketwave.backend.repository.UserProfileRepo;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.stereotype.Service;
//
//import java.util.HashSet;
//import java.util.Objects;
//import java.util.Optional;
//import java.util.Set;
//
//@Service
//public class UserAccountService {
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private UserAccountRepo userAccountRepository;
//
//    @Autowired
//    private RoleRepository roleRepository;
//    @Autowired
//    private UserProfileRepo userProfileRepo;
//
//    public UserAccount createSuperAdmin(UserAccount userAccount) {
//
//        // Find or create the SUPER_ADMIN role
//        Role superAdminRole = roleRepository.findByRoleName("SUPER_ADMIN")
//                .orElseGet(() -> {
//                    Role newRole = new Role();
//                    newRole.setRoleName("SUPER_ADMIN");
//                    return roleRepository.save(newRole);
//                });
//        // Set the SUPER_ADMIN role to the user account
//        if (userAccount.getRoles() == null) {
//            userAccount.setRoles(new HashSet<>());
//        }
//        userAccount.getRoles().add(superAdminRole);
////        String generatedPassword = PasswordGenerator.generateRandomPassword();
//        userAccount.setPassword(userAccount.getPassword());
//
//        return userAccountRepository.save(userAccount);
//    }
//
//    // Method for logging in
////    public UserAccount login(int userId, String password) throws Exception {
////        Optional<UserAccount> userAccount = userAccountRepository.findById(userId);
////
////        if (userAccount.isPresent()) {
////            if (Objects.equals(password, userAccount.get().getPassword())) {
////                return userAccount.get();
////            } else {
////                throw new Exception("Invalid password");
////            }
////        } else {
////            throw new Exception("User not found");
////        }
////    }
//
//    public UserAccount createUser(UserAccountDTO userAccountDTO) throws Exception {
//
//        // Get logged-in super admin (or current user)
//        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        String username = userPrincipal.getUsername();
//        UserAccount userAccnt = userAccountRepository.findByUsername(username);
//
//        // Get the current user's email who is the sender
//        String senderEmail = userAccnt.getUserProfile().getEmail();
//
//        Set<Role> roles = new HashSet<>();
//
//        //to find if the role exists in the database and if not create a new one. should be used when roles are not created already
//        for (Role role : userAccountDTO.getRoles()) {
//            // Check if the role exists, if not, create a new one
//            Role foundRole = roleRepository.findByRoleName(role.getRoleName())
//                    .orElseGet(() -> {
//                        Role newRole = new Role();
//                        newRole.setRoleName(role.getRoleName());
//                        return roleRepository.save(newRole);  // Save the new role in the database
//                    });
//            roles.add(foundRole);  // Add the found or newly created role to the set
//        }
//
//        String generatedPassword = PasswordGenerator.generateRandomPassword();
//
//
//        //to find if the role exists in the database and if not give an exception. should be used when roles are already created
////        for (Role role : userAccountDTO.getRoles()) {
////            Role foundRole = roleRepository.findByRoleName(role.getRoleName())
////                    .orElseThrow(() -> new RuntimeException("Role not found: " + role.getRoleName()));
////            roles.add(foundRole);
////        }
////        userAccount.setRoles(roles);
//
//        UserProfile userProfile = new UserProfile();
//        userProfile.setUserId(userAccountDTO.getUserId());
//        userProfile.setUserName(userAccountDTO.getName());
//        userProfile.setEmail(userAccountDTO.getEmail());
//        userProfile.setDesignation(userAccountDTO.getDesignation());
//        userProfile.setJoinedDate(userAccountDTO.getJoinedDate());
//        userProfile.setBranchId(userAccountDTO.getBranchId());
//        userProfile.setDepartmentId(userAccountDTO.getDepartmentId());
//        userProfile.setNextReportingPerson(userAccountDTO.getNextReportingPerson());
//        userProfile.setUserPhoneNumber(userAccountDTO.getUserPhoneNumber());
//        userProfile.setMaritalStatus(userAccountDTO.getMaritalStatus());
//        userProfile.setAddress(userAccountDTO.getAddress());
//        userProfile.setCreatedBy(userAccnt.getUserId());
//
//
//
//        UserAccount userAccount = new UserAccount();
//        userAccount.setUserId(userAccountDTO.getUserId());
//        userAccount.setUsername(userAccountDTO.getUsername());
//        userAccount.setPassword(generatedPassword);
//        userAccount.setRoles(roles);
////        userAccount.setUserProfile(userProfile);
////        userProfile.setUserAccount(userAccount);
////        userProfile.setUserAccount(userAccount);
//        userAccount.setUserProfile(userProfile);
//
//        // Send email from the logged-in user's email
//        String emailBody = "Dear " + userAccountDTO.getName() + ",\n\n" +
//                "Your account has been created successfully. Here are your credentials:\n" +
//                "Username: " + userAccountDTO.getUsername() + "\n" +
//                "Password: " + generatedPassword + "\n\n" +
//                "Please log in to the system and change your password .";
//
//        emailService.sendEmail(senderEmail, userAccountDTO.getEmail(), "Login to Ticketwave", emailBody);
//
//        return (userAccountRepository.save(userAccount));
//    }
//
//    public void resetPassword(String username, String newPassword) {
//        UserAccount userAccount = userAccountRepository.findByUsername(username);
//        if(userAccount == null) {
//            throw new RuntimeException("User not found");
//        }
//
//        // Encrypt and update the new password
////        String newEncryptedPassword = passwordEncoder.encode(newPassword.getNewPassword());
//        userAccount.setPassword(newPassword);
//        userAccountRepository.save(userAccount);
//    }
//}



package com.ticketwave.backend.service;

import com.ticketwave.backend.model.notification.NotificationType;
import com.ticketwave.backend.model.role.Role;
import com.ticketwave.backend.model.user.*;
import com.ticketwave.backend.repository.DeletedUserRepo;
import com.ticketwave.backend.repository.RoleRepo;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.UserProfileRepo;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.*;

@Service
public class UserAccountService {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserAccountRepo userAccountRepository;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private UserProfileRepo userProfileRepo;

    @Autowired
    private NotificationService notificationService;

    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    @Autowired
    private DeletedUserRepo deletedUserRepo;

//    @Autowired
//    private PasswordEncoder passwordEncoder; // Password encoder bean

    public UserAccount createSuperAdmin(UserAccount userAccount) {
        // Find or create the SUPER_ADMIN role
        Role superAdminRole = roleRepo.findByRoleName("SUPER_ADMIN")
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRoleName("SUPER_ADMIN");
                    return roleRepo.save(newRole);
                });

        // Set the SUPER_ADMIN role to the user account
        if (userAccount.getRoles() == null) {
            userAccount.setRoles(new HashSet<>());
        }
        userAccount.getRoles().add(superAdminRole);

        // Encode the password before saving
//        userAccount.setPassword(passwordEncoder.encode(userAccount.getPassword()));
        userAccount.setPassword(userAccount.getPassword());
        return userAccountRepository.save(userAccount);
    }

    // Retrieves all users with the SUPER_ADMIN role
    public List<UserAccount> getSuperAdmins() {
        return (List<UserAccount>) userAccountRepository.findByRoles_RoleName("SUPER_ADMIN");
    }

    public UserAccount createUser(UserAccountDTO userAccountDTO) throws Exception {

        Optional<UserAccount> existingUser = userAccountRepository.findById(userAccountDTO.getUserId());
        if (existingUser.isPresent()) {
            throw new Exception("User already exists with user ID: " + userAccountDTO.getUserId());
        }

        // Get logged-in super admin (or current user)
        UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username = userPrincipal.getUsername();
        UserAccount userAccnt = userAccountRepository.findByUsername(username);

        // Get the current user's email who is the sender
//        String senderEmail = userAccnt.getUserProfile().getEmail();
        String senderEmail = "ticketwaveinfo@gmail.com";

        Set<Role> roles = new HashSet<>();

        // Check if roles exist in the database and create them if not
        for (Role role : userAccountDTO.getRoles()) {
            Role foundRole = roleRepo.findByRoleName(role.getRoleName())
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setRoleName(role.getRoleName());
                        return roleRepo.save(newRole);  // Save the new role in the database
                    });
            roles.add(foundRole);  // Add the found or newly created role to the set
        }

        String generatedPassword = PasswordGenerator.generateRandomPassword();

        UserProfile userProfile = new UserProfile();
        userProfile.setUserId(userAccountDTO.getUserId());
        userProfile.setName(userAccountDTO.getName());
        userProfile.setEmail(userAccountDTO.getEmail());
        userProfile.setDesignation(userAccountDTO.getDesignation());
        userProfile.setGrade(userAccountDTO.getGrade());
        userProfile.setJoinedDate(userAccountDTO.getJoinedDate());
        userProfile.setBranchId(userAccountDTO.getBranchId());
        userProfile.setDepartmentId(userAccountDTO.getDepartmentId());
        userProfile.setNextReportingPerson(userAccountDTO.getNextReportingPerson());
        userProfile.setUserPhoneNumber(userAccountDTO.getUserPhoneNumber());
        userProfile.setMaritalStatus(userAccountDTO.getMaritalStatus());
        userProfile.setAddress(userAccountDTO.getAddress());
        userProfile.setCreatedBy(userAccnt.getUserId());
        userProfile.setCreatedDate(LocalDateTime.now().toString());

        UserAccount userAccount = new UserAccount();
        userAccount.setUserId(userAccountDTO.getUserId());
        userAccount.setUsername(userAccountDTO.getUsername());
        userAccount.setPassword(generatedPassword); // Encode the generated password
        userAccount.setRoles(roles);
        userAccount.setUserProfile(userProfile);

//        String emailBody = "<html>" +
//                "<head>" +
//                "<style>" +
//                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }" +
//                ".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
//                ".header { background-color: #007bff; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }" +
//                ".content { padding: 20px; }" +
//                ".footer { text-align: center; padding: 10px; font-size: 12px; color: #777; }" +
//                ".button-container { text-align: center; }" +
//                "</style>" +
//                "</head>" +
//                "<body>" +
//                "<div class='container'>" +
//                "<div class='header'>" +
//                "<h2>Welcome to Ticketwave!</h2>" +
//                "</div>" +
//                "<div class='content'>" +
//                "<p>Dear " + userAccountDTO.getName() + ",</p>" +
//                "<p>Your account has been successfully created. Below are your login credentials:</p>" +
//                "<p><strong>Username:</strong> " + userAccountDTO.getUsername() + "</p>" +
//                "<p><strong>Password:</strong> " + generatedPassword + "</p>" +
//                "<p>Please click the button below to log in to the system:</p>" +
//                "<div class='button-container'>" +
//                "<a href='https://ticketwave.onrender.com' style='display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px;'>Login to Ticketwave</a>" +
//                "</div>" +
//                "<p>If you have any questions or need assistance, feel free to contact our support team.</p>" +
//                "<p>Best regards,<br/>The Ticketwave Team</p>" +
//                "</div>" +
//                "<div class='footer'>" +
//                "<p>This is an automated message, please do not reply directly to this email.</p>" +
//                "</div>" +
//                "</div>" +
//                "</body>" +
//                "</html>";
//
//        // Send email from the logged-in user's email
//        emailService.sendEmail(senderEmail, userAccountDTO.getEmail(), "Welcome to Ticketwave - Your Account Has Been Created", emailBody);


        // After user creation, create a notification for super admins
        List<UserAccount> superAdmins = getSuperAdmins();
        for (UserAccount superAdmin : superAdmins) {
            notificationService.createNotification(
                    "A new user with user ID: "+userAccountDTO.getUserId()+" requires approval.",
                    userAccnt.getUserId(),
                    (long)userAccountDTO.getUserId(),
                    superAdmin.getUserId(),  // sender (admin who created the user)
                    // superAdmin.getUserId(),  // recipient (super admin)
                    NotificationType.valueOf("CREATEUSER")
            );
        }

        return userAccountRepository.save(userAccount);
    }

    public void resetPassword(String username, String newPassword) {
        UserAccount userAccount = userAccountRepository.findByUsername(username);
        if (userAccount == null) {
            throw new RuntimeException("User not found");
        }

        // Encrypt and update the new password
        userAccount.setPassword(newPassword); // Encode the new password
        userAccountRepository.save(userAccount);
    }

    public void sendApprovalEmail(UserAccount userAccount) throws Exception {
        String senderEmail = "ticketwaveinfo@gmail.com";
        String recipientEmail = userAccount.getUserProfile().getEmail();

        String emailBody = "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                ".header { background-color: #007bff; color: #fff; padding: 10px; text-align: center; border-radius: 8px 8px 0 0; }" +
                ".content { padding: 20px; }" +
                ".footer { text-align: center; padding: 10px; font-size: 12px; color: #777; }" +
                ".button-container { text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>Welcome to Ticketwave!</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear " + userAccount.getUserProfile().getName() + ",</p>" +
                "<p>Your account has been approved. Below are your login credentials:</p>" +
                "<p><strong>Username:</strong> " + userAccount.getUsername() + "</p>" +
                "<p><strong>Password:</strong> " + userAccount.getPassword() + "</p>" +
                "<p>Please click the button below to log in to the system:</p>" +
                "<div class='button-container'>" +
                "<a href='https://ticketwave.onrender.com' style='display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px;'>Login to Ticketwave</a>" +
                "</div>" +
                "<p>If you have any questions or need assistance, feel free to contact our support team.</p>" +
                "<p>Best regards,<br/>The Ticketwave Team</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>This is an automated message, please do not reply directly to this email.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";

        emailService.sendEmail(senderEmail, recipientEmail, "Welcome to Ticketwave - Your Account Has Been Approved", emailBody);
    }



    // the below functions are dedicated for the users who have forgotten their pwd and change it.
    public void generateResetToken(String username) throws Exception {

        UserAccount user  = userAccountRepository.findByUsername(username);
        int id = Integer.valueOf(user.getUserId());
        UserProfile userProfile = userProfileRepo.findById(id).get();
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setPasswordReset(true);
        user.setExpiryDate(LocalDateTime.now().plusHours(1)); // Token expires in 1 hour
        userAccountRepository.save(user);

        


//        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String resetLink = frontendUrl + "/reset-password?token=" + token + "&sg_click_id=0";
        String emailBody = "<html>" +
                "<head>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }" +
                ".container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                ".footer { text-align: center; padding: 10px; font-size: 12px; color: #777; }" +
                ".button-container { text-align: center; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<div class='header'>" +
                "<h2>Password Reset Request</h2>" +
                "</div>" +
                "<div class='content'>" +
                "<p>Dear " + userProfile.getName() + ",</p>" +
                "<p>We received a request to reset your password. You can reset your password by clicking the button below:</p>" +
                "<div class='button-container'>" +
                "<a href='" + resetLink + "' style='display: inline-block; padding: 12px 24px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px;'>Reset Password</a>" +
                "</div>" +
                "<p>If you did not request a password reset, please ignore this email or contact our support team if you have any concerns.</p>" +
                "<p>For security purposes, this password reset link will expire in 1 hour.</p>" +
                "<p>Best regards,<br/>The Ticketwave Team</p>" +
                "</div>" +
                "<div class='footer'>" +
                "<p>This is an automated message, please do not reply directly to this email.</p>" +
                "</div>" +
                "</div>" +
                "</body>" +
                "</html>";



        emailService.sendEmail("ticketwaveinfo@gmail.com",userProfile.getEmail() , "Password Reset Request", emailBody);
    }

    public void newPassword(String token, String newPassword) {
//        UserAccount user = userAccountRepository.findByResetToken(token);
        UserAccount user = userAccountRepository.findByResetToken(token);
        if (user == null || user.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired token");
        }

        user.setPassword(newPassword); // Consider encoding the password
        user.setResetToken(null);
        user.setExpiryDate(null);
        userAccountRepository.save(user);
    }

    //delete user
//    public void deleteUser(int userId) {
//        userAccountRepository.deleteById(userId);
//    }

    public void deleteUser(int userId) {
        try {
            // Log the start of the deletion process
            System.out.println("Starting deletion process for user ID: " + userId);

            // Get the user who is performing the deletion
            UserPrincipal userPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            String deletedByUsername = userPrincipal.getUsername();
            UserAccount deletedByUser = userAccountRepository.findByUsername(deletedByUsername);

            // Log the user performing the deletion
            System.out.println("Deletion performed by user ID: " + deletedByUser.getUserId() + ", Username: " + deletedByUsername);

            // Fetch the user to be deleted
            UserAccount userAccount = userAccountRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Log the user being deleted
            System.out.println("User to be deleted - ID: " + userAccount.getUserId() + ", Username: " + userAccount.getUsername());

            // Save deleted user details to the deleted_users table
            DeletedUser deletedUser = new DeletedUser();
            deletedUser.setDeletedUserId(userAccount.getUserId()); // Set the deleted user's ID
            deletedUser.setDeletedUsername(userAccount.getUsername());
            deletedUser.setDepartment(userAccount.getUserProfile().getDepartmentId());
            deletedUser.setRole(userAccount.getRoles().toString());

            //creator
            int createdByUserId = userAccount.getUserProfile().getCreatedBy();
            UserAccount createdByUser = userAccountRepository.findById(createdByUserId)
                    .orElseThrow(() -> new RuntimeException("User who created this account not found"));
            deletedUser.setCreatedBy(createdByUser.getUsername());

//Next reporting person
            int nextReportPersonId = Integer.parseInt(userAccount.getUserProfile().getNextReportingPerson());
            UserAccount NextReportPserson = userAccountRepository.findById(nextReportPersonId)
                    .orElseThrow(() -> new RuntimeException("User who created this account not found"));
            deletedUser.setCreatedBy(NextReportPserson.getUsername());


            deletedUser.setDeletedByUserId(deletedByUser.getUserId());
            deletedUser.setDeletedByUsername(deletedByUsername);
            deletedUser.setDeletionTimestamp(LocalDateTime.now());

            // Log the details being saved to the deleted_users table
            System.out.println("Saving deleted user details: " + deletedUser);

            deletedUserRepo.save(deletedUser); // Save the new record

            // Log successful save to deleted_users table
            System.out.println("Deleted user details saved successfully.");

            // Delete the user from the user_account table
            userAccountRepository.deleteById(userId);

            // Log successful deletion
            System.out.println("User deleted successfully from user_account table.");
        } catch (Exception e) {
            // Log any errors that occur
            System.err.println("Error during deletion process: " + e.getMessage());
            e.printStackTrace();
            throw e; // Re-throw the exception to propagate it
        }
    }


//    public void changePassword(String username, String newPassword) {
//        UserAccount userAccount = userAccountRepository.findByUsername(username);
//        if (userAccount == null) {
//            throw new RuntimeException("User not found");
//        }
//
//        // Encrypt and update the new password
//        userAccount.setPassword(passwordEncoder.encode(newPassword)); // Encode the new password
//        userAccountRepository.save(userAccount);
//    }
}
