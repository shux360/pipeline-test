package com.ticketwave.backend.controller;

//import com.ticketwave.backend.model.notification.Notification;
import com.ticketwave.backend.model.notification.NotificationDetails;
import com.ticketwave.backend.model.notification.NotificationDetailsDTO;
import com.ticketwave.backend.model.notification.NotificationType;
import com.ticketwave.backend.model.notification.Notifications;
import com.ticketwave.backend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;


    @PostMapping("/create")
    public ResponseEntity<Notifications> createNotification(
            @RequestParam int senderUserId,
            @RequestParam Long requestId,
            @RequestParam int receiverUserId,
            @RequestParam NotificationType notificationType,
            @RequestParam String message) {
        Notifications createdNotification = notificationService.createNotification(
                message,
                senderUserId,
                requestId,
                receiverUserId,
                notificationType
        );
        return ResponseEntity.ok(createdNotification);
    }

    @PostMapping("/{notificationId}/add-details")
    public ResponseEntity<Notifications> addNotificationDetails(
            @PathVariable Long notificationId,
            @RequestParam int senderUserId,
            @RequestParam int receiverUserId,
            @RequestParam Long requestId,
            @RequestParam NotificationType notificationType,
            @RequestParam String message) {
        Notifications updatedNotification = notificationService.addNotificationDetails(
                notificationId,
                senderUserId,
                receiverUserId,
                requestId,
                notificationType,
                message
        );
        return ResponseEntity.ok(updatedNotification);
    }

    @GetMapping("/{notificationId}/details")
    public ResponseEntity<List<NotificationDetails>> getNotificationDetails(@PathVariable Long notificationId) {
        List<NotificationDetails> details = notificationService.getNotificationDetails(notificationId);
        return ResponseEntity.ok(details);
    }

    //get unread notifications by receiverUserId
    @GetMapping("/{receiverUserId}")
    public List<NotificationDetailsDTO> getUnreadNotifications(@PathVariable int receiverUserId) {
        return notificationService.getUnreadNotifications(receiverUserId);
    }

    @PostMapping("/mark-as-read")
    public ResponseEntity<String> markNotificationDetailsAsRead(@RequestBody List<Long> notificationDetailIds) {
        notificationService.markNotificationDetailsAsRead(notificationDetailIds);
        return ResponseEntity.ok("Notification details marked as read");
    }

//    @PostMapping("/create")
//    public ResponseEntity<Notification> createNotification(@RequestBody Notification notification) {
//        Notification createdNotification = notificationService.createNotification(notification.getMessage(), notification.getSenderUserId(), (long) notification.getRecieverUserId(),notification.getRecieverUserId(),notification.getNotificationType());
//        return ResponseEntity.ok(createdNotification);
//    }
//    @GetMapping("/{userId}")
//    public List<Notification> getUnreadNotifications(@PathVariable int userId) {
//        return notificationService.getUnreadNotifications(userId);
//    }
//
//    @PostMapping("/mark-as-read")
//    public ResponseEntity<String> markNotificationsAsRead(@RequestBody List<Long> notificationIds) {
//        notificationService.markNotificationsAsRead(notificationIds);
//        return ResponseEntity.ok("Notifications marked as read");
//    }
}







