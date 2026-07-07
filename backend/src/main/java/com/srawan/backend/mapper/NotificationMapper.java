package com.srawan.backend.mapper;

import com.srawan.backend.entity.Notification;
import com.srawan.backend.dto.NotificationResponse;

public class NotificationMapper {
    private NotificationMapper(){}

    public static NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(notification.getId(), notification.getMessage(), notification.isReadStatus(), notification.getCreatedAt());
    }
}
