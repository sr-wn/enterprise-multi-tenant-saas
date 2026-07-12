package com.srawan.backend.controller;

import com.srawan.backend.dto.SupportTicketRequest;
import com.srawan.backend.dto.SupportTicketResponse;
import com.srawan.backend.service.SupportTicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support-tickets")
public class SupportTicketController {

    private final SupportTicketService ticketService;

    public SupportTicketController(SupportTicketService ticketService){
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<SupportTicketResponse> raiseTicket(
            @Valid @RequestBody SupportTicketRequest request
    ){
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ticketService.raiseTicket(request.issue()));
    }

    @GetMapping("/mine")
    public List<SupportTicketResponse> getMyTickets(){
        return ticketService.getMyTickets();
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<SupportTicketResponse> getTenantTickets(){
        return ticketService.getTenantTickets();
    }

    @PatchMapping("/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public SupportTicketResponse resolveTicket(@PathVariable Long id){
        return ticketService.resolveTicket(id);
    }
}
