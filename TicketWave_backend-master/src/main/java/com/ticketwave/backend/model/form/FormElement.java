package com.ticketwave.backend.model.form;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@ToString(exclude = {"formDetail", "options"})
//@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity

public class FormElement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;
    private String label;
    private String placeholder;
    private boolean required;


    @OneToMany(mappedBy = "formElement", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FormElementOption> options = new ArrayList<>();

    private String accept;

    @Column(name = "element_order")
    private int order;

    @ManyToOne
    @JoinColumn(name = "form_detail_id", nullable = false)
    @JsonBackReference
    private FormDetail formDetail;

    public void addOption(String optionValue) {
        FormElementOption option = new FormElementOption();
        FormElementOptionKey key = new FormElementOptionKey();
        key.setFormElementId(this.id);
        key.setOptionValue(optionValue);
        option.setId(key);
        option.setFormElement(this);
        option.setOptionValue(optionValue);
        this.options.add(option);
    }

    @Override
    public String toString() {
        return "FormElement{" +
                "id=" + id +
                ", type='" + type + '\'' +
                ", label='" + label + '\'' +
                ", placeholder='" + placeholder + '\'' +
                ", required=" + required +
                ", accept='" + accept + '\'' +
                ", order=" + order +
                '}';
    }
}
