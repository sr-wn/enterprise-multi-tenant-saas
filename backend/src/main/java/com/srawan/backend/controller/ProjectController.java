package com.srawan.backend.controller;
import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;
import com.srawan.backend.service.ProjectService;

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
    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ProjectResponse createProject(@Valid @RequestBody CreateProjectRequest request){

        return projectService.createProject(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Page<ProjectResponse> getProjects(
        Pageable pageable
){

    return projectService.getProjects(
            pageable
    );

}
    
}
