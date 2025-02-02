package com.ticketwave.backend.model.form;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Data


@Embeddable
public class FormElementOptionKey implements Serializable {

    private Long formElementId;
    @Column(name = "option_value")
    private String optionValue;

    public FormElementOptionKey() {
    }

    public FormElementOptionKey(Long formElementId, String optionValue) {
        this.formElementId = formElementId;
        this.optionValue = optionValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FormElementOptionKey that = (FormElementOptionKey) o;
        return Objects.equals(formElementId, that.formElementId) &&
                Objects.equals(optionValue, that.optionValue);
    }

    @Override
    public int hashCode() {
        return Objects.hash(formElementId, optionValue);
    }
    // Getters, setters, hashCode, equals
}