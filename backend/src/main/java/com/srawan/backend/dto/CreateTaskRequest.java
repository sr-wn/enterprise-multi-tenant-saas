package com.srawan.backend.dto;


import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;



public class CreateTaskRequest {



    @NotBlank(message = "Task title is required")
    private String title;




    @NotBlank(message = "Description is required")
    private String description;




    @NotBlank(message = "Priority is required")
    private String priority;




    @NotNull(message = "Due date is required")
    private LocalDate dueDate;




    @NotNull(message = "Project id is required")
    private Long projectId;




    @NotNull(message = "Assigned user is required")
    private Long assignedUserId;








    public String getTitle() {

        return title;

    }





    public String getDescription() {

        return description;

    }





    public String getPriority() {

        return priority;

    }





    public LocalDate getDueDate() {

        return dueDate;

    }





    public Long getProjectId() {

        return projectId;

    }





    public Long getAssignedUserId() {

        return assignedUserId;

    }



}