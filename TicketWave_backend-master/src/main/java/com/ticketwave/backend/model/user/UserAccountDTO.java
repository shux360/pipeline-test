package com.ticketwave.backend.model.user;

import com.ticketwave.backend.model.role.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserAccountDTO {
    private int userId; // Provided by the frontend

    private String username;
    private String password;
    private Set<Role> roles = new HashSet<>();

    private String name;
    private String email;
    private String designation;
    private String grade;
    private LocalDate joinedDate;
    private String branchId;
    private String departmentId;
    private String nextReportingPerson;
    private String userPhoneNumber;
    private String maritalStatus;
    private String address;
    private int createdBy;
    private String profileImage;

    public UserAccountDTO(int userId, String name) {
        this.userId = userId;
        this.name = name;
    }

}
