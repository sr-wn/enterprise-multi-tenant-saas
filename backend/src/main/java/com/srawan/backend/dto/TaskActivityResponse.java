package com.srawan.backend.dto;


import java.time.LocalDateTime;


public class TaskActivityResponse {


    private String performedBy;


    private String action;


    private String oldValue;


    private String newValue;


    private LocalDateTime createdAt;




    public TaskActivityResponse(
            String performedBy,
            String action,
            String oldValue,
            String newValue,
            LocalDateTime createdAt
    ){

        this.performedBy = performedBy;

        this.action = action;

        this.oldValue = oldValue;

        this.newValue = newValue;

        this.createdAt = createdAt;

    }




    public String getPerformedBy() {
        return performedBy;
    }


    public String getAction() {
        return action;
    }


    public String getOldValue() {
        return oldValue;
    }


    public String getNewValue() {
        return newValue;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


}