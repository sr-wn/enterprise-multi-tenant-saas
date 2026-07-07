package com.srawan.backend.dto;


import java.time.LocalDateTime;


public class TaskCommentResponse {


    private Long id;


    private String message;


    private String user;


    private LocalDateTime createdAt;





    public TaskCommentResponse(

            Long id,

            String message,

            String user,

            LocalDateTime createdAt

    ){

        this.id = id;

        this.message = message;

        this.user = user;

        this.createdAt = createdAt;

    }





    public Long getId(){

        return id;

    }



    public String getMessage(){

        return message;

    }



    public String getUser(){

        return user;

    }



    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}