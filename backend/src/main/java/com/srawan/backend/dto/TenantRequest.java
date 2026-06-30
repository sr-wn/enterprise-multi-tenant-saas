package com.srawan.backend.dto;

public record TenantRequest(
    String companyName,
    String companyEmail
) {}