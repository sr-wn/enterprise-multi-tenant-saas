package com.srawan.backend.service;

import com.srawan.backend.dto.CreateUserRequest;
import com.srawan.backend.dto.UserResponse;

import com.srawan.backend.entity.User;

import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.DuplicateResourceException;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;


@Service
public class UserService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;



    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

    }   





    public UserResponse createUser(CreateUserRequest request){


        if(userRepository.existsByEmail(request.email())){


            throw new DuplicateResourceException(
                "User with email already exists"
            );


        }



        User admin=(User) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();





        User user=new User(

            request.fullName(),

            request.email(),

            passwordEncoder.encode(
                request.password()
            ),

            request.role()

        );





        user.setTenant(
            admin.getTenant()
        );





        User savedUser=userRepository.save(user);




        return new UserResponse(

            savedUser.getId(),

            savedUser.getFullname(),

            savedUser.getEmail(),

            savedUser.getRole()

        );

    }


}