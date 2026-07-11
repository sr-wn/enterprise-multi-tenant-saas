package com.srawan.backend.service;


import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;

import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.User;

import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.TaskCommentRepository;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.repository.TaskAttachmentRepository;

import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;

import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Pageable;



@Service
public class ProjectService {


    private final ProjectRepository projectRepository;

    private final UserRepository userRepository;

    private final TaskRepository taskRepository;

    private final TaskCommentRepository taskCommentRepository;

    private final TaskActivityRepository taskActivityRepository;

    private final TaskAttachmentRepository taskAttachmentRepository;



    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository, TaskRepository taskRepository, TaskCommentRepository taskCommentRepository, TaskActivityRepository taskActivityRepository, TaskAttachmentRepository taskAttachmentRepository) {

        this.projectRepository = projectRepository;

        this.userRepository = userRepository;

        this.taskRepository = taskRepository;

        this.taskCommentRepository = taskCommentRepository;

        this.taskActivityRepository = taskActivityRepository;

        this.taskAttachmentRepository = taskAttachmentRepository;

    }







    public ProjectResponse createProject(CreateProjectRequest request) {


        User currentUser=getCurrentUser();



        Project project=new Project();


        project.setName(request.getName());

        project.setDescription(request.getDescription());

        project.setTenant(currentUser.getTenant());

        project.setCreatedBy(currentUser);



        if(request.getAssignedUserId() != null){

            User assignedUser = userRepository.findById(request.getAssignedUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assigned user not found"));

            if(!assignedUser.getTenant().id().equals(currentUser.getTenant().id())){
                throw new UnauthorizedActionException("Cannot assign a user from another tenant");
            }

            project.setAssignedTo(assignedUser);

        }



        Project saved=projectRepository.save(project);



        return mapToResponse(saved);


    }








    public Page<ProjectResponse> getProjects(Pageable pageable){


        User currentUser=getCurrentUser();


        if(currentUser.getRole().name().equals("ADMIN")){

            return projectRepository
                .findByTenant(
                        currentUser.getTenant(),
                        pageable
                )
                .map(this::mapToResponse);

        }


     return projectRepository

        .findByTenantAndAssignedTo(
                currentUser.getTenant(),
                currentUser,
                pageable
        )

        .map(this::mapToResponse);

    }

    public ProjectResponse getProjectById(Long id) {
        User currentUser = getCurrentUser();
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project Not Found"));

        if (!project.getTenant().id().equals(currentUser.getTenant().id())) {
            throw new UnauthorizedActionException("Unauthorized");
        }

        return mapToResponse(project);
    }


    @Transactional
    public void deleteProject(Long id) {

        User currentUser = getCurrentUser();

        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Project Not Found"));

        if (!project.getTenant().id().equals(currentUser.getTenant().id())) {
            throw new UnauthorizedActionException("Cannot delete another tenant's project");
        }

        for (Task task : taskRepository.findByProject(project)) {
            taskActivityRepository.deleteByTask(task);
            taskCommentRepository.deleteByTask(task);
            taskAttachmentRepository.deleteByTask(task);
            taskRepository.delete(task);
        }

        projectRepository.delete(project);

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

                project.getName(),

                project.getDescription(),

                project.getCreatedBy().getFullname(),

                project.getCreatedAt(),

                project.getAssignedTo() != null ? project.getAssignedTo().getId() : null,

                project.getAssignedTo() != null ? project.getAssignedTo().getFullname() : null,

                taskRepository.countByProject(project)

        );


    }



}