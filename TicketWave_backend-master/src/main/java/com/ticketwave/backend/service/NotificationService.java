package com.ticketwave.backend.service;

//import com.ticketwave.backend.model.notification.Notification;
import com.ticketwave.backend.model.notification.*;
import com.ticketwave.backend.repository.NotificationDetailsRepository;
import com.ticketwave.backend.repository.NotificationsRepository;
//import com.ticketwave.backend.repository.NotificationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationsRepository notificationsRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationDetailsRepository notificationDetailsRepository;

    @Autowired
    private NotificationDetailsMapper notificationDetailsMapper;


    public Notifications createNotification( String message,int senderUserId, Long requestId, int receiverUserId, NotificationType notificationType) {
        // Create a new notification
        Notifications notification = new Notifications();
        notification.setTimestamp(LocalDateTime.now());

        // Save the notification
        Notifications savedNotification = notificationsRepository.save(notification);

        // Create notification details
        NotificationDetails notificationDetails = new NotificationDetails();
        notificationDetails.setSenderUserId(senderUserId);
        notificationDetails.setReceiverUserId(receiverUserId);
        notificationDetails.setRequestId(requestId);
        notificationDetails.setMessage(message);
        notificationDetails.setNotificationType(notificationType);
        notificationDetails.setTimestamp(LocalDateTime.now());
        notificationDetails.setRead(false);
        notificationDetails.setDelivered(false);
        notificationDetails.setSeen(false);
        notificationDetails.setNotifications(savedNotification);

        // Save the notification details
        notificationDetailsRepository.save(notificationDetails);

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverUserId, savedNotification);

        return savedNotification;
    }

    public Notifications addNotificationDetails(Long notificationId, int senderUserId, int receiverUserId, Long requestId, NotificationType notificationType, String message) {
        // Fetch the existing notification
        Notifications notification = notificationsRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // Create new notification details
        NotificationDetails notificationDetails = new NotificationDetails();
        notificationDetails.setSenderUserId(senderUserId);
        notificationDetails.setReceiverUserId(receiverUserId);
        notificationDetails.setRequestId(requestId);
        notificationDetails.setMessage(message);
        notificationDetails.setNotificationType(notificationType);
        notificationDetails.setTimestamp(LocalDateTime.now());
        notificationDetails.setRead(false);
        notificationDetails.setDelivered(false);
        notificationDetails.setSeen(false);
        notificationDetails.setNotifications(notification);

        // Save the notification details
        notificationDetailsRepository.save(notificationDetails);

        // Send WebSocket notification
        messagingTemplate.convertAndSend("/topic/notifications/" + receiverUserId, notification);

        return notification;
    }

    public List<NotificationDetails> getNotificationDetails(Long notificationId) {
        return notificationDetailsRepository.findByNotifications_NotificationId(notificationId);
    }

    public List<NotificationDetailsDTO> getUnreadNotifications(int receiverUserId) {
        List<NotificationDetails> unreadNotifications = notificationDetailsRepository.findByReceiverUserIdAndIsReadFalse(receiverUserId);
        return unreadNotifications.stream()
                .map(notificationDetailsMapper::toDTO)
                .collect(Collectors.toList());
    }

    public void markNotificationDetailsAsRead(List<Long> notificationDetailIds) {
        List<NotificationDetails> notificationDetails = notificationDetailsRepository.findAllById(notificationDetailIds);
        notificationDetails.forEach(detail -> detail.setRead(true));
        notificationDetailsRepository.saveAll(notificationDetails);
    }



//    public Notification createNotification(String message, int senderUserId, Long requestId, int recieverUserId, NotificationType notificationType) {
//        // Create a new notification object
//        Notification notification = new Notification();
//        notification.setMessage(message);
//        notification.setRecieverUserId(recieverUserId);
//        notification.setSenderUserId(senderUserId);
//        notification.setRequestId(requestId);
//        notification.setNotificationType(notificationType);
//        notification.setRead(false);
//        notification.setDelivered(false);
//        notification.setSeen(false);
//        notification.setTimestamp(LocalDateTime.now());
//
//
//        Notification savedNotification = notificationRepository.save(notification);
//
//        messagingTemplate.convertAndSend("/topic/notifications/" + recieverUserId, savedNotification);
//
//        return savedNotification;
//    }
//
//    public List<Notification> getUnreadNotifications(int recieverUserId) {
//        return notificationRepository.findByRecieverUserIdAndIsReadFalse(recieverUserId);
//    }
//
//
//    public void markNotificationsAsRead(List<Long> notificationIds) {
//
//        List<Notification> notifications = notificationRepository.findAllById(notificationIds);
//        notifications.forEach(notification -> notification.setRead(true));
//        notificationRepository.saveAll(notifications);
//    }



}
