package com.srawan.backend.auth;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.srawan.backend.repository.TenantRepository;
import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.dto.LoginRequest;
import com.srawan.backend.entity.User;
import com.srawan.backend.dto.LoginResponse;
import com.srawan.backend.service.JwtService;

@Service
public class AuthService {
    
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, TenantRepository tenantRepository, PasswordEncoder passwordEncoder, JwtService jwtService){
        this.userRepository=userRepository;
        this.tenantRepository=tenantRepository;
        this.passwordEncoder = passwordEncoder;
       this.jwtService=jwtService; 
    }

    public LoginResponse login(LoginRequest request){

        User user=userRepository.findByEmail(request.email()).orElseThrow(()->new RuntimeException("User Not found"));

        if(!passwordEncoder.matches(request.password(), user.getPassword())){
            throw new RuntimeException("Invalid credentials");
        }
        String token=jwtService.generateToken(user.getEmail());

        return new LoginResponse(token);

        }
    }

