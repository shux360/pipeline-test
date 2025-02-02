package com.ticketwave.backend.model.notification;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;


import java.time.LocalDateTime;

@Data
@Entity
public class NotificationDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long notificationDetailId;

    private int senderUserId;
    private int receiverUserId;
    private Long requestId;
    private String message;
    private LocalDateTime timestamp;
    private boolean isRead;
    private boolean delivered;
    private boolean seen;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @ManyToOne
    @JoinColumn(name = "notificationId", nullable = false)
    @JsonBackReference
    private Notifications notifications;
}