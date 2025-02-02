package com.ticketwave.backend.model.user;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
@Entity
public class DeletedUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate the primary key
    private int id; // New primary key

    private int deletedUserId; // Store the deleted user's ID

    private String deletedUsername;

    private int deletedByUserId;

    private String deletedByUsername;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deletionTimestamp;


    private String Department;

    private String role;

    private String createdBy;
    private String nextReportingPerson;
}