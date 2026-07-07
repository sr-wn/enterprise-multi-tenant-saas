package com.srawan.backend.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
public class Notification {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;




    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;




    private String message;




    private boolean readStatus = false;




    private LocalDateTime createdAt;





    @PrePersist
    public void onCreate(){

        createdAt = LocalDateTime.now();

    }







    public Long getId(){

        return id;

    }







    public User getUser(){

        return user;

    }



    public void setUser(User user){

        this.user = user;

    }







    public String getMessage(){

        return message;

    }



    public void setMessage(String message){

        this.message = message;

    }







    public boolean isReadStatus(){

        return readStatus;

    }



    public void setReadStatus(boolean readStatus){

        this.readStatus = readStatus;

    }







    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}