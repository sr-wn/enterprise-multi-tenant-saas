package com.srawan.backend.dto;


import com.srawan.backend.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;



public record CreateUserRequest(



        @NotBlank(
            message = "Full name is required"
        )
        String fullName,





        @Email(
            message = "Invalid email format"
        )
        @NotBlank(
            message = "Email is required"
        )
        String email,







        @Size(
            min = 6,
            message = "Password must have minimum 6 characters"
        )
        @NotBlank(
            message = "Password is required"
        )
        String password,







        @NotNull(
            message = "Role is required"
        )
        Role role




){}