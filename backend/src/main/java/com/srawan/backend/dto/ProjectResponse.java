package com.srawan.backend.dto;

import java.time.LocalDateTime;

public class ProjectResponse {
    private Long id;
    private String name;
    private String description;
    private String createdBy;
    private LocalDateTime createdAt;
    private Long assignedToId;
    private String assignedTo;
    private long taskCount;

    public ProjectResponse(Long id, String name, String description, String createdBy, LocalDateTime createdAt, Long assignedToId, String assignedTo, long taskCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.assignedToId = assignedToId;
        this.assignedTo = assignedTo;
        this.taskCount = taskCount;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public long getTaskCount() {
        return taskCount;
    }

}
