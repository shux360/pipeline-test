package com.ticketwave.backend.repository;

import com.ticketwave.backend.model.notification.NotificationDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationDetailsRepository extends JpaRepository<NotificationDetails, Long> {
    List<NotificationDetails> findByNotifications_NotificationId(Long notificationId);

    List<NotificationDetails> findByReceiverUserIdAndIsReadFalse(int receiverUserId);
}