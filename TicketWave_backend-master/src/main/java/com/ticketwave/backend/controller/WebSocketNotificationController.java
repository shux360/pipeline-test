package com.ticketwave.backend.controller;

import com.ticketwave.backend.model.notification.Notifications;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ws-notifications")
public class WebSocketNotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send")
    public void sendNotification(@RequestBody Notifications notification) {
        System.out.println("Sending notification to user: " + notification.getNotificationDetails().get(0).getReceiverUserId());
        System.out.println("Notification details: " + notification);

        messagingTemplate.convertAndSend(
                "/user/" + notification.getNotificationDetails().get(0).getReceiverUserId() + "/queue/notifications",
                notification
        );

        System.out.println("Notification sent to WebSocket destination: /user/"
                + notification.getNotificationDetails().get(0).getReceiverUserId() + "/queue/notifications");
    }



}
