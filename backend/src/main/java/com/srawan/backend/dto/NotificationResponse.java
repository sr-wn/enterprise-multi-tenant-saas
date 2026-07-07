package com.srawan.backend.dto;


import java.time.LocalDateTime;


public class NotificationResponse {


    private Long id;


    private String message;


    private boolean readStatus;


    private LocalDateTime createdAt;





    public NotificationResponse(

            Long id,

            String message,

            boolean readStatus,

            LocalDateTime createdAt

    ){

        this.id = id;

        this.message = message;

        this.readStatus = readStatus;

        this.createdAt = createdAt;

    }





    public Long getId(){

        return id;

    }



    public String getMessage(){

        return message;

    }



    public boolean isReadStatus(){

        return readStatus;

    }



    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}