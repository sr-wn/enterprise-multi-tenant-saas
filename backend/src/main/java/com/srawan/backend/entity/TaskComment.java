package com.srawan.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Id;

@Entity
public class TaskComment {
    
 @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;



    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;



    @Column(
            nullable = false,
            length = 1000
    )
    private String message;



    private LocalDateTime createdAt;




    @PrePersist
    public void onCreate(){

        createdAt = LocalDateTime.now();

    }





    public Long getId(){

        return id;

    }





    public Task getTask(){

        return task;

    }



    public void setTask(Task task){

        this.task = task;

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





    public LocalDateTime getCreatedAt(){

        return createdAt;

    }


}

