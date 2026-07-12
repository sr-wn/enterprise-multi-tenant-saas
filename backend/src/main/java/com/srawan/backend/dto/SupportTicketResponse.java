package com.srawan.backend.dto;

import java.time.LocalDateTime;

public class SupportTicketResponse {

    private Long id;
    private String issue;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String requesterName;
    private String requesterEmail;

    public SupportTicketResponse(
            Long id,
            String issue,
            String status,
            LocalDateTime createdAt,
            LocalDateTime resolvedAt,
            String requesterName,
            String requesterEmail
    ){
        this.id = id;
        this.issue = issue;
        this.status = status;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.requesterName = requesterName;
        this.requesterEmail = requesterEmail;
    }

    public Long getId(){
        return id;
    }

    public String getIssue(){
        return issue;
    }

    public String getStatus(){
        return status;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public LocalDateTime getResolvedAt(){
        return resolvedAt;
    }

    public String getRequesterName(){
        return requesterName;
    }

    public String getRequesterEmail(){
        return requesterEmail;
    }
}
