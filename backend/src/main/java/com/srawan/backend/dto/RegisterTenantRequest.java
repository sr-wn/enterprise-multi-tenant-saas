package com.srawan.backend.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;



public record RegisterTenantRequest(


        @NotBlank(
            message = "Company name is required"
        )
        String companyName,



        @Email(
            message = "Invalid company email"
        )
        @NotBlank(
            message = "Company email is required"
        )
        String companyEmail,




        @NotBlank(
            message = "Admin name is required"
        )
        String adminName,




        @Email(
            message = "Invalid admin email"
        )
        @NotBlank(
            message = "Admin email is required"
        )
        String adminEmail,




        @Size(
            min = 6,
            message = "Password must have minimum 6 characters"
        )
        @NotBlank(
            message = "Password is required"
        )
        String adminPassword


){}