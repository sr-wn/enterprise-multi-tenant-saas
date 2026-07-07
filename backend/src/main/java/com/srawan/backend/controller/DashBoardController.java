package com.srawan.backend.controller;

import com.srawan.backend.dto.DashBoardResponse;

import com.srawan.backend.service.DashBoardService;


import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashBoardController {

    private final DashBoardService dashBoardService;

    public DashBoardController(DashBoardService dashBoardService) {
        this.dashBoardService = dashBoardService;
    }

    @GetMapping
    public DashBoardResponse getDashboard() {
        return dashBoardService.getDashboard();
    }
    
}
