package com.srawan.backend.entity;

import com.srawan.backend.enums.SupportTicketStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "support_tickets")
public class SupportTicket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @Column(nullable = false, length = 1000)
    private String issue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SupportTicketStatus status = SupportTicketStatus.IN_PROGRESS;

    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @PrePersist
    public void onCreate(){
        createdAt = LocalDateTime.now();
    }

    public Long getId(){
        return id;
    }

    public Tenant getTenant(){
        return tenant;
    }

    public void setTenant(Tenant tenant){
        this.tenant = tenant;
    }

    public User getRequester(){
        return requester;
    }

    public void setRequester(User requester){
        this.requester = requester;
    }

    public String getIssue(){
        return issue;
    }

    public void setIssue(String issue){
        this.issue = issue;
    }

    public SupportTicketStatus getStatus(){
        return status;
    }

    public void setStatus(SupportTicketStatus status){
        this.status = status;
    }

    public LocalDateTime getCreatedAt(){
        return createdAt;
    }

    public LocalDateTime getResolvedAt(){
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt){
        this.resolvedAt = resolvedAt;
    }
}
