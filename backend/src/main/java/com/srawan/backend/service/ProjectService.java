package com.srawan.backend.service;


import com.srawan.backend.dto.CreateProjectRequest;
import com.srawan.backend.dto.ProjectResponse;
import com.srawan.backend.entity.Project;
import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import com.srawan.backend.entity.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository, UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    public ProjectResponse createProject(CreateProjectRequest request) {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));
        Project project=new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setTenant(currentUser.getTenant());
        project.setCreatedBy(currentUser);
        Project saved=projectRepository.save(project);
        return mapToResponse(saved);
    }

    public List<ProjectResponse> getProjects(){
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser=userRepository.findByEmail(email).orElseThrow(()->new RuntimeException("User Not Found"));
        return projectRepository.findByTenant(currentUser.getTenant()).stream().map(this::mapToResponse).collect(Collectors.toList());
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
