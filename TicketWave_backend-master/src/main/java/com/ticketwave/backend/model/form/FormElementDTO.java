package com.ticketwave.backend.model.form;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormElementDTO {
    private Long id;
    private String type;
    private String label;
    private String placeholder;
    private boolean required;
    private List<OptionDTO> options = new ArrayList<>();
    private String accept;
    private int order;

    // Getters and setters
}

