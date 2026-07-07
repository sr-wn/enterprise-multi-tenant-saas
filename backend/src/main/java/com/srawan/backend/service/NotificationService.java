package com.srawan.backend.service;

import com.srawan.backend.entity.Notification;
import com.srawan.backend.entity.User;

import com.srawan.backend.repository.NotificationRepository;
import com.srawan.backend.dto.NotificationResponse;

import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.mapper.NotificationMapper;

import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    public List<NotificationResponse> getMyNotifications(){


    User currentUser =
            getCurrentUser();



    return notificationRepository

            .findByUserOrderByCreatedAtDesc(
                    currentUser
            )

            .stream()

            .map(
                    notification -> NotificationMapper.toResponse(notification)
 )

            .toList();


}


public NotificationResponse markAsRead(
        Long notificationId
){


    User currentUser =
            getCurrentUser();



    Notification notification =
            notificationRepository
                    .findById(notificationId)
                    .orElseThrow(
                        () -> new RuntimeException(
                            "Notification not found"
                        )
                    );



    if(
        !notification
                .getUser()
                .getId()
                .equals(
                    currentUser.getId()
                )
    ){

        throw new RuntimeException(
            "Cannot access another user's notification"
        );

    }




    notification.setReadStatus(true);



    Notification updated =
            notificationRepository.save(
                    notification
            );



    return NotificationMapper.toResponse(
            updated
    );


}

private User getCurrentUser(){


    String email =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();



    return userRepository

            .findByEmail(email)

            .orElseThrow(
                () -> new RuntimeException("User not found")
            );


}


    public void createNotification(User user, String message){ 
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }
    
}
