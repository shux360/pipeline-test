package com.ticketwave.backend.model.notification;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long notificationId;

   private int senderUserId;
   private int recieverUserId;
   private String message;
   private Long requestId;

   @Enumerated(EnumType.STRING)
   private NotificationType notificationType;
   private LocalDateTime timestamp;
   private boolean isRead;
   private boolean delivered;
   private boolean seen;

}
