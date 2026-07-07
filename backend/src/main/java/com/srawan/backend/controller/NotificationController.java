package com.srawan.backend.controller;

import com.srawan.backend.dto.NotificationResponse;
import com.srawan.backend.service.NotificationService;

import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    
 private final NotificationService notificationService;




    public NotificationController(
            NotificationService notificationService
    ){

        this.notificationService = notificationService;

    }



@PatchMapping("/{id}/read")
public NotificationResponse markAsRead(

        @PathVariable Long id

){

    return notificationService
            .markAsRead(id);

}


    @GetMapping
    public List<NotificationResponse> getMyNotifications(){


        return notificationService.getMyNotifications();


    }



}


