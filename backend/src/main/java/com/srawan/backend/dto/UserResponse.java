package com.srawan.backend.dto;

import com.srawan.backend.enums.Role;

public record UserResponse(Long id, String fullname ,String email,Role role) {
    
}
