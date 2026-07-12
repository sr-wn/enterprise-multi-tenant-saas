package com.srawan.backend.controller;

import com.srawan.backend.dto.NotificationResponse;
import com.srawan.backend.dto.NotificationCountResponse;
import com.srawan.backend.service.NotificationService;

import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


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

@GetMapping("/count")
public NotificationCountResponse getUnreadNotifications() {
    return new NotificationCountResponse(
            notificationService.countUnreadNotifications()
    );
}


   @GetMapping
public Page<NotificationResponse> getMyNotifications(

        Pageable pageable

){


    return notificationService.getMyNotifications(

            pageable

    );


}

}



