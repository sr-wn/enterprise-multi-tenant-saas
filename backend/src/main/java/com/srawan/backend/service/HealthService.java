package com.srawan.backend.service;

import org.springframework.stereotype.Service;

import com.srawan.backend.dto.HealthResponse;

@Service
public class HealthService {
    
    public HealthResponse getHealthStatus(){
        return new HealthResponse("Up", "backend", "1.0");

    }
}
