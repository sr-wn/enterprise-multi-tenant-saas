package com.srawan.backend.dto;

public record HealthResponse(
    String status,
    String application,
    String version
) {
}