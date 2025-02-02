package com.ticketwave.backend.model.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.context.annotation.Scope;

import java.time.LocalDate;
@Scope("prototype")
@Data
@NoArgsConstructor
@AllArgsConstructor

//@JsonIdentityInfo(
//        generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "userId"
//)
//@JsonIgnoreProperties("userAccount")
@Entity
public class UserProfile {
    @Id
    private int userId; // Same UserID as in UserAccount

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String designation;

    @Column(nullable = false)
    private String grade;

    private LocalDate joinedDate;

    @Column(nullable = false)
    private String branchId;

    @Column(nullable = false)
    private String departmentId;

    private String nextReportingPerson;
    private String userPhoneNumber;
    private String maritalStatus;
    private String address;

//    @OneToOne(mappedBy = "userProfile")
//    private UserAccount userAccount;
    @Column(name = "profile_picture", columnDefinition = "LONGBLOB")
    private byte[] profileImage;


    //    @ManyToOne
    @Column(name = "created_by_user_id")
    private Integer createdBy; // Reference to the creator (admin or super admin)

    @Column(name = "created_date")
    private String createdDate;

    private boolean approved=false;
    private String comment;}
