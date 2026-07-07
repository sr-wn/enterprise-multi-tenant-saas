package com.srawan.backend.service;


import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;

import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.User;

import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.ResourceNotFoundException;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;



@Service
public class ProjectService {


    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;



    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {

        this.projectRepository = projectRepository;

        this.userRepository = userRepository;

    }







    public ProjectResponse createProject(CreateProjectRequest request) {


        User currentUser=getCurrentUser();



        Project project=new Project();


        project.setName(request.getName());

        project.setDescription(request.getDescription());

        project.setTenant(currentUser.getTenant());

        project.setCreatedBy(currentUser);



        Project saved=projectRepository.save(project);



        return mapToResponse(saved);


    }








    public Page<ProjectResponse> getProjects(Pageable pageable){


        User currentUser=getCurrentUser();



     return projectRepository

        .findByTenant(
                currentUser.getTenant(),
                pageable
        )

        .map(this::mapToResponse);


    }









    private User getCurrentUser(){


        String email=SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();




        return userRepository
                .findByEmail(email)
                .orElseThrow(
                    () -> new ResourceNotFoundException(
                        "User Not Found"
                    )
                );


    }










    private ProjectResponse mapToResponse(Project project){


        return new ProjectResponse(

                project.getId(),

                project.getFullname(),

                project.getDescription(),

                project.getCreatedBy().getFullname(),

                project.getCreatedAt()

        );


    }



}