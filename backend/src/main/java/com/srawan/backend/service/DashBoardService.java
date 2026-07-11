package com.srawan.backend.service;

import com.srawan.backend.dto.DashBoardResponse;

import com.srawan.backend.entity.User;

import com.srawan.backend.enums.TaskStatus;

import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.UserRepository;

import com.srawan.backend.exception.ResourceNotFoundException;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.stereotype.Service;



@Service
public class DashBoardService {


 private final ProjectRepository projectRepository;


    private final TaskRepository taskRepository;


    private final UserRepository userRepository;





    public DashBoardService(

            ProjectRepository projectRepository,

            TaskRepository taskRepository,

            UserRepository userRepository

    ){


        this.projectRepository = projectRepository;

        this.taskRepository = taskRepository;

        this.userRepository = userRepository;


    }






    public DashBoardResponse getDashboard(){


        User currentUser =
                getCurrentUser();



        Long tenantId =
                currentUser
                        .getTenant()
                        .id();





        long totalProjects =
                projectRepository
                        .countByTenantId(
                                tenantId
                        );



        long totalUsers =
                userRepository
                        .countByTenantId(
                                tenantId
                        );



        long totalTasks =
                taskRepository
                        .countByProjectTenantId(
                                tenantId
                        );




        long todoTasks =
                taskRepository
                        .countByProjectTenantIdAndStatus(

                                tenantId,

                                TaskStatus.TODO

                        );




        long inProgressTasks =
                taskRepository
                        .countByProjectTenantIdAndStatus(

                                tenantId,

                                TaskStatus.IN_PROGRESS

                        );




        long completedTasks =
                taskRepository
                        .countByProjectTenantIdAndStatus(

                                tenantId,

                                TaskStatus.DONE

                        );





        return new DashBoardResponse(

                currentUser.getTenant().getCompanyName(),

                totalProjects,

                totalUsers,

                totalTasks,

                todoTasks,

                inProgressTasks,

                completedTasks

        );


    }










    private User getCurrentUser(){


        String email =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getName();




        return userRepository

                .findByEmail(email)

                .orElseThrow(

                    () -> new ResourceNotFoundException(
                            "User not found"
                    )

                );


    }


}