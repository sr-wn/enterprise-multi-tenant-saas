package com.srawan.backend.dto;

import java.time.LocalDateTime;

import com.srawan.backend.enums.TaskStatus;

import java.time.LocalDate;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private TaskStatus status;
    private String priority;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private String assignedTo;
    private String createdBy;
    private Long projectId;
    private String projectName;

    public TaskResponse(Long id, String title, String description, TaskStatus status, String priority, LocalDate dueDate, LocalDateTime createdAt, String assignedTo, String createdBy, Long projectId, String projectName) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.assignedTo = assignedTo;
        this.createdBy = createdBy;
        this.projectId = projectId;
        this.projectName = projectName;
    }

    public TaskResponse() {
    }

    public Long getId() {
        return id;
    }
    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public String getPriority() {
        return priority;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectName() {
        return projectName;
    }


    
}
