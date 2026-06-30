package com.srawan.backend.controller;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import com.srawan.backend.dto.HealthResponse;
import com.srawan.backend.service.HealthService;
import java.util.Map;

@RestController
public class HealthController {
private final HealthService healthService;
public HealthController(HealthService healthService) {
    this.healthService = healthService;
}

public HealthResponse health(){
    return healthService.getHealthStatus();
}
}



