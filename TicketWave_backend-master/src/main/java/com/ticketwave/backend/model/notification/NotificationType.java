package com.ticketwave.backend.model.notification;

import jakarta.persistence.Entity;

public enum NotificationType {
    REQUEST,
    APPROVAL,
    REJECTION,
    COMMENT,
    INFO,
    USERREJECTED,
    USERAPPROVED,
    CREATEUSER,
    DELETEUSER,

}
