package com.srawan.backend.dto;

public record RegisterTenantRequest(
    String companyName,
    String companyEmail,
    String adminName,
    String adminEmail,
    String adminPassword
) {}
