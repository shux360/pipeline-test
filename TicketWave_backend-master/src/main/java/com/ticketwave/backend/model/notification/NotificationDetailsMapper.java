package com.ticketwave.backend.model.notification;

import org.springframework.stereotype.Component;

@Component
public class NotificationDetailsMapper {
    public NotificationDetailsDTO toDTO(NotificationDetails notificationDetails) {

        NotificationDetailsDTO dto = new NotificationDetailsDTO();
        dto.setNotificationId(notificationDetails.getNotifications().getNotificationId());
        dto.setNotificationDetailId(notificationDetails.getNotificationDetailId());
        dto.setSenderUserId(notificationDetails.getSenderUserId());
        dto.setReceiverUserId(notificationDetails.getReceiverUserId());
        dto.setRequestId(notificationDetails.getRequestId());
        dto.setMessage(notificationDetails.getMessage());
        dto.setTimestamp(notificationDetails.getTimestamp());
        dto.setRead(notificationDetails.isRead());
        dto.setDelivered(notificationDetails.isDelivered());
        dto.setSeen(notificationDetails.isSeen());
        dto.setNotificationType(notificationDetails.getNotificationType().name());
        return dto;
    }
}