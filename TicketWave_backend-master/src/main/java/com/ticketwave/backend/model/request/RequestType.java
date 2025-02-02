package com.ticketwave.backend.model.request;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ticketwave.backend.model.role.Role;
import com.ticketwave.backend.model.workflow.Workflow;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class RequestType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false, unique = true)
    private Long requestId;

    private String requestCategory;
    private String priority;
    private String requestName;
    private String requestCode;
    private Boolean attachmentsAllowed;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "request_roles",
            joinColumns = @JoinColumn(name = "request_id"),
            inverseJoinColumns = @JoinColumn(name = "roles")
    )
    private Set<Role> roles = new HashSet<>();


}
