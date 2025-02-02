package com.ticketwave.backend.model.form;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor


// DTO class
public class FormDTO {
    @NotNull
    private String requestId;
    @NotEmpty
    private List<FormElementDTO> elements;

    // Getters and setters
}


