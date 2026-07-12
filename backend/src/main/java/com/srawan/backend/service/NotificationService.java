package com.srawan.backend.service;

import com.srawan.backend.entity.Notification;
import com.srawan.backend.entity.User;

import com.srawan.backend.repository.NotificationRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.dto.NotificationResponse;

import com.srawan.backend.mapper.NotificationMapper;

import com.srawan.backend.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.srawan.backend.exception.UnauthorizedActionException;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;



@Service
public class NotificationService {


    private final NotificationRepository notificationRepository;


    private final UserRepository userRepository;





    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {

        this.notificationRepository = notificationRepository;

        this.userRepository = userRepository;

    }








public Page<NotificationResponse> getMyNotifications(

        Pageable pageable

){


    User currentUser =
            getCurrentUser();



    return notificationRepository

            .findByUserOrderByCreatedAtDesc(

                    currentUser,

                    pageable

            )


            .map(
                    NotificationMapper::toResponse
            );


}










public NotificationResponse markAsRead(Long notificationId){



    User currentUser =
            getCurrentUser();





    Notification notification =
            notificationRepository

                    .findById(notificationId)

                    .orElseThrow(

                        () -> new ResourceNotFoundException(
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


        throw new UnauthorizedActionException(

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









    public long countUnreadNotifications() {
        User currentUser = getCurrentUser();
        return notificationRepository.countByUserAndReadStatusFalse(currentUser);
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

                () -> new ResourceNotFoundException(
                    "User not found"
                )

            );


}









public void createNotification(User user, String message){ 

    Notification notification =
            new Notification();



    notification.setUser(user);


    notification.setMessage(message);



    notificationRepository.save(
            notification
    );


}



}