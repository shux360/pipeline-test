//package com.ticketwave.backend.mapper;
//
//import com.ticketwave.backend.model.request.ApprovalLevelDTO;
//import com.ticketwave.backend.model.request.ApprovalLevel;
//import com.ticketwave.backend.model.request.RequestType;
//import org.springframework.stereotype.Component;
//
//@Component
//public class ApprovalLevelMapper {
//
//    public static ApprovalLevelDTO toDTO(ApprovalLevel approvalLevel) {
//        ApprovalLevelDTO dto = new ApprovalLevelDTO();
//        dto.setDesignation(approvalLevel.getDesignation());
//        dto.setApprover(approvalLevel.getApprover());
//        dto.setEscalatingTime(approvalLevel.getEscalatingTime());
//        dto.setRequestTypeId(approvalLevel.getRequestType().getRequestId()); // Reference to RequestType
//        return dto;
//    }
//
//    public static ApprovalLevel toEntity(ApprovalLevel dto, RequestType requestType) {
//        ApprovalLevel approvalLevel = new ApprovalLevel();
//        approvalLevel.setDesignation(dto.getDesignation());
//        approvalLevel.setApprover(dto.getApprover());
//        approvalLevel.setEscalatingTime(dto.getEscalatingTime());
//        approvalLevel.setRequestType(requestType);
//        return approvalLevel;
//    }
//}