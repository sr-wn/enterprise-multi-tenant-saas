package com.srawan.backend.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.srawan.backend.dto.LoginRequest;
import com.srawan.backend.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import com.srawan.backend.auth.AuthService;
import org.springframework.web.bind.annotation.PostMapping;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService=authService;
    }


    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse Login(@RequestBody LoginRequest request){
        return authService.login(request);
    }
}
