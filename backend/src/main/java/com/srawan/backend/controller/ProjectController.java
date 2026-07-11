package com.srawan.backend.controller;
import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;
import com.srawan.backend.service.ProjectService;

import com.srawan.backend.dto.TaskResponse;
import com.srawan.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;
    public ProjectController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse createProject(@Valid @RequestBody CreateProjectRequest request){

        return projectService.createProject(request);
    }

    @GetMapping
    public Page<ProjectResponse> getProjects(
        Pageable pageable
){

        return projectService.getProjects(pageable);
    }

    @GetMapping("/{id}")
    public ProjectResponse getProjectById(@PathVariable Long id) {
        return projectService.getProjectById(id);
    }

    @GetMapping("/{id}/tasks")
    public Page<TaskResponse> getProjectTasks(@PathVariable Long id, Pageable pageable) {
        return taskService.getTasksByProjectId(id, pageable);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteProject(@PathVariable Long id){
        projectService.deleteProject(id);
    }
    
}
