package com.srawan.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SupportTicketRequest(

        @NotBlank(
            message = "Issue description is required"
        )
        @Size(
            max = 1000,
            message = "Issue must be at most 1000 characters"
        )
        String issue

){}
