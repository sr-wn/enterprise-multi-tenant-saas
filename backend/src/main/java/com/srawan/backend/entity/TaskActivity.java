package com.srawan.backend.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;

@Entity
public class TaskActivity {
    

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long Id;


    @ManyToOne
    @JoinColumn(name="task-id")
    private Task task;


@ManyToOne
@JoinColumn(name="performed-by")
    private User performedBy;


    private String action;

    private String oldValue;

    private String newValue;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        createdAt=LocalDateTime.now();
    }


    public Long getId() {
        return Id;
    }


    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(User performedBy) {
        this.performedBy = performedBy;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getOldValue() {
        return oldValue;
    }

    public void setOldValue(String oldValue) {
        this.oldValue = oldValue;
    }

    public String getNewValue() {
        return newValue;
    }

    public void setNewValue(String newValue) {
        this.newValue = newValue;
    }   

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }



}
