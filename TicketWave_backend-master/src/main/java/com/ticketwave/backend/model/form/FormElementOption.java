package com.ticketwave.backend.model.form;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

//@Data
@Getter
@Setter
@ToString(exclude = {"formElement"})
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FormElementOption {

    @EmbeddedId
    private FormElementOptionKey id;

    @ManyToOne
    @MapsId("formElementId")
    @JoinColumn(name = "form_element_id")
    @JsonBackReference
    private FormElement formElement;

    @Column(name = "option_value",insertable=false, updatable=false)
    private String optionValue;

    @Override
    public String toString() {
        return "FormElementOption{" +
                "id=" + id +
                ", optionValue='" + optionValue + '\'' +
                '}';
    }
}


