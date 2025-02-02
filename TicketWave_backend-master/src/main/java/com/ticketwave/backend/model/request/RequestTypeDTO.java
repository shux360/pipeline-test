package com.ticketwave.backend.model.request;

import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestTypeDTO {
    @NotBlank
    private String requestName;

    @NotBlank
    private String requestCode;

    @NotBlank
    private String requestCategory;

    @NotNull
    private String priority;

    private boolean attachmentsAllowed;

    private List<String> roles;

}