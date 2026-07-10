package com.srawan.backend.controller;
import com.srawan.backend.dto.CreateUserRequest;
import com.srawan.backend.dto.UserResponse;
import com.srawan.backend.service.UserService;
import java.util.List;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public UserResponse createUser(@Valid @RequestBody CreateUserRequest request){
        return userService.createUser(request);
    }
    @GetMapping
@PreAuthorize("hasRole('ADMIN')")
public List<UserResponse> getUsers(){

    return userService.getUsers();

}
    
}
