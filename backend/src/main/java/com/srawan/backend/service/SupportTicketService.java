package com.srawan.backend.service;

import com.srawan.backend.dto.SupportTicketResponse;
import com.srawan.backend.entity.SupportTicket;
import com.srawan.backend.entity.Tenant;
import com.srawan.backend.entity.User;
import com.srawan.backend.enums.Role;
import com.srawan.backend.enums.SupportTicketStatus;
import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;
import com.srawan.backend.repository.SupportTicketRepository;
import com.srawan.backend.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupportTicketService {

    private final SupportTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public SupportTicketService(
            SupportTicketRepository ticketRepository,
            UserRepository userRepository,
            NotificationService notificationService
    ){
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public SupportTicketResponse raiseTicket(String issue){
        User currentUser = getCurrentUser();
        Tenant tenant = currentUser.getTenant();

        SupportTicket ticket = new SupportTicket();
        ticket.setTenant(tenant);
        ticket.setRequester(currentUser);
        ticket.setIssue(issue);
        ticket.setStatus(SupportTicketStatus.IN_PROGRESS);
        SupportTicket saved = ticketRepository.save(ticket);

        String message = "Support ticket from " + currentUser.getFullname()
                + " (" + currentUser.getEmail() + "): " + issue;
        for (User admin : userRepository.findByTenantAndRole(tenant, Role.ADMIN)){
            notificationService.createNotification(admin, message);
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getMyTickets(){
        User currentUser = getCurrentUser();
        return ticketRepository
                .findByTenantAndRequester(currentUser.getTenant(), currentUser)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> getTenantTickets(){
        User currentUser = getCurrentUser();
        return ticketRepository
                .findByTenant(currentUser.getTenant())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SupportTicketResponse resolveTicket(Long id){
        User currentUser = getCurrentUser();
        if (!Role.ADMIN.name().equals(currentUser.getRole().name())){
            throw new UnauthorizedActionException("Only an admin can resolve tickets");
        }

        SupportTicket ticket = ticketRepository
                .findByIdAndTenant(id, currentUser.getTenant())
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

        ticket.setStatus(SupportTicketStatus.RESOLVED);
        ticket.setResolvedAt(LocalDateTime.now());
        SupportTicket saved = ticketRepository.save(ticket);

        notificationService.createNotification(
                ticket.getRequester(),
                "Your support ticket was resolved by the admin: " + ticket.getIssue()
        );

        return toResponse(saved);
    }

    private SupportTicketResponse toResponse(SupportTicket ticket){
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getIssue(),
                ticket.getStatus().name(),
                ticket.getCreatedAt(),
                ticket.getResolvedAt(),
                ticket.getRequester().getFullname(),
                ticket.getRequester().getEmail()
        );
    }

    private User getCurrentUser(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
