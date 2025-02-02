package com.ticketwave.backend.model.form;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ticketwave.backend.model.request.RequestType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//@Data
@Getter
@Setter
@ToString(exclude = {"elements", "requestType"})
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "Form_Detail")
public class FormDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long formId;

    private Long requestId;

    @OneToMany(mappedBy = "formDetail", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    @JsonManagedReference
    private List<FormElement> elements = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToOne
    @JoinColumn(name = "requestId", referencedColumnName = "requestId", insertable = false, updatable = false)
    private RequestType requestType;

    public void addElement(FormElement element) {
        if (element == null) {
            throw new IllegalArgumentException("Element cannot be null");
        }
        elements.add(element);
        element.setFormDetail(this);
    }

    @Override
    public String toString() {
        return "FormDetail{" +
                "formId=" + formId +
                ", requestId=" + requestId +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }


}
