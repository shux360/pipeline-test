package com.ticketwave.backend.model.notification;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationDetailsDTO {
    private Long notificationId;
    private Long notificationDetailId;
    private int senderUserId;
    private int receiverUserId;
    private Long requestId;
    private String message;
    private LocalDateTime timestamp;
    private boolean isRead;
    private boolean delivered;
    private boolean seen;
    private String notificationType;
}