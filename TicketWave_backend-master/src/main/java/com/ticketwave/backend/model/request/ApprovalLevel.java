//package com.ticketwave.backend.model.request;
//
//import com.fasterxml.jackson.annotation.JsonBackReference;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//@Entity
//public class ApprovalLevel {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String designation;
//
//    private String approver;
//
//    private int escalatingTime;
//
////    private long requestTypeId;
//
//    @ManyToOne
//    @JoinColumn(name = "requestTypeId", nullable = false)
//    @JsonBackReference
//    private RequestType requestType;
//
//    // No additional methods required as Lombok generates them
//}