package com.srawan.backend.dto;
import com.srawan.backend.enums.Role;
public record CreateUserRequest(String fullName, String email, String password, Role role) {
    
}
