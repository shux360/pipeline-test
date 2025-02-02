package com.ticketwave.backend.service;

import com.ticketwave.backend.model.user.UserAccount;
import com.ticketwave.backend.model.user.UserAccountDTO;
import com.ticketwave.backend.model.user.UserIdNameDTO;
import com.ticketwave.backend.model.user.UserProfile;
//import com.ticketwave.backend.model.user.UserProfileDTO;
import com.ticketwave.backend.repository.UserAccountRepo;
import com.ticketwave.backend.repository.UserProfileRepo;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserProfileService {
    @Autowired
    private UserProfileRepo userProfileRepository;

    @Autowired
    private UserAccountRepo userAccountRepository;
    @Autowired
    private UserProfileRepo userProfileRepo;

    public UserProfile createUserProfile(UserProfile userProfile) {
        userProfile.setCreatedDate(java.time.LocalDateTime.now().toString());
        return userProfileRepository.save(userProfile);
    }

    public List<UserAccountDTO> getPendingApprovals() {
        List<UserProfile> pendingProfiles = userProfileRepository.findByApprovedFalse();
        List<UserAccountDTO> profileWithRolesList = new ArrayList<>();

        for (UserProfile profile : pendingProfiles) {
            int userId = profile.getUserId();

            // Retrieve the UserAccount for the given userId
            Optional<UserAccount> accountOpt = userAccountRepository.findById(userId);
            if (accountOpt.isPresent()) {
                UserAccount account = accountOpt.get();

                // Map to DTO
                UserAccountDTO dto = new UserAccountDTO();
                dto.setUserId(userId);
                dto.setUsername(account.getUsername());
                dto.setRoles(account.getRoles()); // Fetch roles directly from UserAccount

                // Populate UserProfile details in DTO
                dto.setName(profile.getName());
                dto.setEmail(profile.getEmail());
                dto.setDesignation(profile.getDesignation());
                dto.setGrade(profile.getGrade());
                dto.setJoinedDate(profile.getJoinedDate());
                dto.setBranchId(profile.getBranchId());
                dto.setDepartmentId(profile.getDepartmentId());
                dto.setNextReportingPerson(profile.getNextReportingPerson());
                dto.setUserPhoneNumber(profile.getUserPhoneNumber());
                dto.setMaritalStatus(profile.getMaritalStatus());
                dto.setAddress(profile.getAddress());
                dto.setCreatedBy(profile.getCreatedBy());

                profileWithRolesList.add(dto);
            }
        }
        return profileWithRolesList;
    }

    public UserAccountDTO getUserDetailsById(int userId) {
        // Retrieve the UserProfile for the given userId
        Optional<UserProfile> profileOpt = userProfileRepository.findById(userId);
        if (!profileOpt.isPresent()) {
            throw new EntityNotFoundException("User profile not found for ID: " + userId);
        }

        UserProfile profile = profileOpt.get();

        // Retrieve the UserAccount for the given userId
        Optional<UserAccount> accountOpt = userAccountRepository.findById(userId);
        if (!accountOpt.isPresent()) {
            throw new EntityNotFoundException("User account not found for ID: " + userId);
        }

        UserAccount account = accountOpt.get();

        // Map to DTO
        UserAccountDTO dto = new UserAccountDTO();
        dto.setUserId(userId);
        dto.setUsername(account.getUsername());
        dto.setRoles(account.getRoles()); // Fetch roles directly from UserAccount

        // Populate UserProfile details in DTO
        dto.setName(profile.getName());
        dto.setEmail(profile.getEmail());
        dto.setDesignation(profile.getDesignation());
        dto.setGrade(profile.getGrade());
        dto.setJoinedDate(profile.getJoinedDate());
        dto.setBranchId(profile.getBranchId());
        dto.setDepartmentId(profile.getDepartmentId());
        dto.setNextReportingPerson(profile.getNextReportingPerson());
        dto.setUserPhoneNumber(profile.getUserPhoneNumber());
        dto.setMaritalStatus(profile.getMaritalStatus());
        dto.setAddress(profile.getAddress());
        dto.setCreatedBy(profile.getCreatedBy());

        if (profile.getProfileImage() != null) {
            dto.setProfileImage(Base64.getEncoder().encodeToString(profile.getProfileImage()));
        } else {
            dto.setProfileImage(null); // Set to null if no profile image exists
        }

        return dto;
    }


    public UserProfile uploadProfileImage(int userId, byte[] imageData) {
        UserProfile userProfile = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User profile not found for ID: " + userId));
        userProfile.setProfileImage(imageData);
        return userProfileRepository.save(userProfile);
    }



    public UserProfile getUserProfile(int userId) {
        return userProfileRepository.findById(userId).orElseThrow();
    }

    public void rejectUser(int userId, String comment) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        userProfile.setApproved(false);
        userProfile.setComment(comment);
        userProfileRepository.save(userProfile);
        // Handle rejection logic, add comment, notify admin
    }

    public void approveUser(int userId) {
        UserProfile userProfile = userProfileRepository.findById(userId).orElseThrow();
        userProfile.setApproved(true);
        userProfileRepository.save(userProfile);

//        // Send an email to the user
//        emailService.sendEmail(userProfile.getEmail(), "Your account has been approved. You can now log in.");
    }
//    private UserAccountDTO convertToDto(UserProfile userProfile) {
//        return new UserAccountDTO(userProfile.getUserId(), userProfile.getName(), userProfile.getEmail(), userProfile.getDesignation());
//    }





    public List<UserAccountDTO> getAllUserProfiles() {
        List<UserProfile> profiles = userProfileRepository.findAll();
        List<UserAccountDTO> userAccountDTOList = new ArrayList<>();

        for (UserProfile profile : profiles) {
            Optional<UserAccount> accountOpt = userAccountRepository.findById(profile.getUserId());
            if (accountOpt.isPresent()) {
                UserAccount account = accountOpt.get();

                // Map to DTO
                UserAccountDTO dto = new UserAccountDTO();
                dto.setUserId(profile.getUserId());
                dto.setUsername(account.getUsername());
                dto.setName(profile.getName());

                dto.setDesignation(profile.getDesignation());
                dto.setGrade(profile.getGrade());

                dto.setDepartmentId(profile.getDepartmentId());


                userAccountDTOList.add(dto);
            }
        }
        return userAccountDTOList;
    }


    public UserAccount updateUserProfile(int userId, UserAccountDTO updatedUser) {
        // Retrieve existing user account
        UserAccount existingAccount = userAccountRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User account not found for ID: " + userId));

        // Update user account fields
        existingAccount.setUsername(updatedUser.getUsername());


        // Retrieve existing user profile
        UserProfile existingProfile = existingAccount.getUserProfile();

        // Update user profile fields
        existingProfile.setName(updatedUser.getName());
        existingProfile.setEmail(updatedUser.getEmail());
        existingProfile.setDesignation(updatedUser.getDesignation());
        existingProfile.setGrade(updatedUser.getGrade());
        existingProfile.setJoinedDate(updatedUser.getJoinedDate());
        existingProfile.setBranchId(updatedUser.getBranchId());
        existingProfile.setDepartmentId(updatedUser.getDepartmentId());
        existingProfile.setNextReportingPerson(updatedUser.getNextReportingPerson());
        existingProfile.setUserPhoneNumber(updatedUser.getUserPhoneNumber());
        existingProfile.setMaritalStatus(updatedUser.getMaritalStatus());
        existingProfile.setAddress(updatedUser.getAddress());

        // Save both user account and user profile
        userProfileRepository.save(existingProfile);
        return userAccountRepository.save(existingAccount);
    }

    public List<UserIdNameDTO> getAllUserIdsAndNames() {
        return userProfileRepo.findAll().stream()
                .map(userProfile -> new UserIdNameDTO(userProfile.getUserId(), userProfile.getName()))
                .collect(Collectors.toList());
    }


    public UserIdNameDTO getUserIdAndNameById(int userId) {
        UserProfile userProfile = userProfileRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User profile not found for ID: " + userId));
        return new UserIdNameDTO(userProfile.getUserId(), userProfile.getName());
    }

    public List<UserIdNameDTO> getUsersByDesignation(String designation) {
        return userProfileRepo.findByDesignation(designation).stream()
                .map(userProfile -> new UserIdNameDTO(userProfile.getUserId(), userProfile.getName()))
                .collect(Collectors.toList());
    }

    public List<UserIdNameDTO> getUsersByGrade(String grade) {
        return userProfileRepo.findByGrade(grade).stream()
                .map(userProfile -> new UserIdNameDTO(userProfile.getUserId(), userProfile.getName()))
                .collect(Collectors.toList());
    }
}