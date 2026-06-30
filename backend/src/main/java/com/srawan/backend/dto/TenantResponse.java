package com.srawan.backend.dto;

public record TenantResponse(
    Long Id,
    String companyName,
    String companyEmail
) {}