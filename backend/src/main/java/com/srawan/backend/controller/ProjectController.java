package com.srawan.backend.controller;
import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;
import com.srawan.backend.service.ProjectService;
import com.srawan.backend.entity.Project;
import org.springframework.http.HttpStatus;
import java.util.List;
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
    public ProjectResponse createProject(@RequestBody CreateProjectRequest request){

        return projectService.createProject(request);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProjectResponse> getProjects() {
        return projectService.getProjects();
    }
    
}
