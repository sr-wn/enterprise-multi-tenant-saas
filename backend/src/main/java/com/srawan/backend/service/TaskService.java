package com.srawan.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.repository.TaskCommentRepository;
import com.srawan.backend.repository.TaskAttachmentRepository;

import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.User;
import com.srawan.backend.entity.TaskActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.srawan.backend.dto.CreateTaskRequest;
import com.srawan.backend.dto.TaskActivityResponse;
import com.srawan.backend.dto.TaskResponse;
import com.srawan.backend.dto.UpdateTaskStatusRequest;
import com.srawan.backend.dto.UpdateTaskRequest;

import com.srawan.backend.enums.TaskStatus;

import com.srawan.backend.service.NotificationService;

import com.srawan.backend.mapper.ActivityMapper;

import com.srawan.backend.exception.ResourceNotFoundException;
import com.srawan.backend.exception.UnauthorizedActionException;


@Service
public class TaskService {

    private TaskRepository taskRepository;
    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private TaskActivityRepository taskActivityRepository;
    private TaskCommentRepository taskCommentRepository;
    private TaskAttachmentRepository taskAttachmentRepository;
    private NotificationService notificationService;


    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository, TaskActivityRepository taskActivityRepository, TaskCommentRepository taskCommentRepository, TaskAttachmentRepository taskAttachmentRepository, NotificationService notificationService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskActivityRepository = taskActivityRepository;
        this.taskCommentRepository = taskCommentRepository;
        this.taskAttachmentRepository = taskAttachmentRepository;
        this.notificationService = notificationService;
    }
    


public TaskResponse createTask(CreateTaskRequest request){

    User currentUser=getCurrentUser();


    Project project = projectRepository.findById(request.getProjectId())
        .orElseThrow(
            () -> new ResourceNotFoundException("Project Not Found")
        );


    if(!project.getTenant().id().equals(currentUser.getTenant().id())){

        throw new UnauthorizedActionException(
            "Cannot access another tenant's project"
        );

    }



    User assignedUser=userRepository.findById(request.getAssignedUserId())
        .orElseThrow(
            () -> new ResourceNotFoundException("User Not Found")
        );



    if(!assignedUser.getTenant().id().equals(currentUser.getTenant().id())){

        throw new UnauthorizedActionException(
            "Cannot assign user from another tenant"
        );

    }




Task task=new Task();

task.setTitle(request.getTitle());
task.setDescription(request.getDescription());
task.setStatus(TaskStatus.TODO);
task.setPriority(request.getPriority());
task.setDueDate(request.getDueDate());
task.setProject(project);
task.setAssignedTo(assignedUser);
task.setCreatedBy(currentUser);


Task saved=taskRepository.save(task);


notificationService.createNotification(
    assignedUser,
    "You have been assigned a task "+saved.getTitle()
);


return mapToResponse(saved);

}





private TaskResponse mapToResponse(Task task){

    return new TaskResponse(

        task.getId(),
        task.getTitle(),
        task.getDescription(),
        task.getStatus(),
        task.getPriority(),
        task.getDueDate(),
        task.getCreatedAt(),
        task.getAssignedTo().getEmail(),
        task.getCreatedBy().getEmail(),
        task.getProject() != null ? task.getProject().getId() : null,
        task.getProject() != null ? task.getProject().getName() : null

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
                () -> new RuntimeException("User not found")
            );

}






public Page<TaskResponse> myTasks(
        Pageable pageable
){

    User currentUser=getCurrentUser();


    return taskRepository
            .findByAssignedTo(currentUser, pageable)
            .map(this::mapToResponse);
}

public Page<TaskResponse> allTenantTasks(Pageable pageable){

    User currentUser = getCurrentUser();

    return taskRepository
            .findByProjectTenant(currentUser.getTenant(), pageable)
            .map(this::mapToResponse);
}

public Page<TaskResponse> getTasksByProjectId(Long projectId, Pageable pageable) {
    User currentUser = getCurrentUser();
    Project project = projectRepository.findById(projectId)
        .orElseThrow(() -> new ResourceNotFoundException("Project Not Found"));

    if (!project.getTenant().id().equals(currentUser.getTenant().id())) {
        throw new UnauthorizedActionException("Unauthorized");
    }

    return taskRepository.findByProject(project, pageable).map(this::mapToResponse);
}








public TaskResponse updateTask(Long taskId, UpdateTaskRequest request) {
    User currentUser = getCurrentUser();

    Task task = taskRepository.findById(taskId)
        .orElseThrow(() -> new ResourceNotFoundException("Task Not Found"));

    // Check authorization (e.g. assigned user or admin)
    if (!task.getAssignedTo().getId().equals(currentUser.getId()) && !currentUser.getRole().name().equals("ADMIN")) {
        throw new UnauthorizedActionException("You can only edit your assigned tasks");
    }

    // Update fields if provided
    boolean updated = false;
    
    if (request.getTitle() != null && !request.getTitle().equals(task.getTitle())) {
        task.setTitle(request.getTitle());
        updated = true;
    }
    
    if (request.getDescription() != null && !request.getDescription().equals(task.getDescription())) {
        task.setDescription(request.getDescription());
        updated = true;
    }
    
    if (request.getPriority() != null && !request.getPriority().equals(task.getPriority())) {
        task.setPriority(request.getPriority());
        updated = true;
    }
    
    if (request.getDueDate() != null && !request.getDueDate().equals(task.getDueDate())) {
        task.setDueDate(request.getDueDate());
        updated = true;
    }

    if (updated) {
        Task updatedTask = taskRepository.save(task);

        TaskActivity activity = new TaskActivity();
        activity.setTask(task);
        activity.setPerformedBy(currentUser);
        activity.setAction("TASK UPDATED");
        activity.setOldValue("Details modified");
        activity.setNewValue("Details modified");
        taskActivityRepository.save(activity);

        return mapToResponse(updatedTask);
    }

    return mapToResponse(task);
}

public TaskResponse updateStatus(Long taskId, UpdateTaskStatusRequest request){


    User currentUser=getCurrentUser();



    Task task=taskRepository.findById(taskId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Task Not Found")
        );




    if(!task.getAssignedTo().getId().equals(currentUser.getId())){


        throw new UnauthorizedActionException(
            "You can update only your assigned tasks"
        );


    }



    TaskStatus oldStatus=task.getStatus();


    task.setStatus(request.getStatus());


    Task updatedTask=taskRepository.save(task);



    TaskActivity activity=new TaskActivity();

    activity.setTask(task);
    activity.setPerformedBy(currentUser);
    activity.setAction("STATUS CHANGED");
    activity.setOldValue(oldStatus.name());
    activity.setNewValue(request.getStatus().name());


    taskActivityRepository.save(activity);



    return mapToResponse(updatedTask);

}






@org.springframework.transaction.annotation.Transactional
public void deleteTask(Long taskId){

    User currentUser = getCurrentUser();

    Task task = taskRepository.findById(taskId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Task Not Found")
        );

    if(!task.getProject().getTenant().id().equals(currentUser.getTenant().id())){
        throw new UnauthorizedActionException(
            "Cannot delete another tenant's task"
        );
    }

    taskActivityRepository.deleteByTask(task);
    taskCommentRepository.deleteByTask(task);
    taskAttachmentRepository.deleteByTask(task);

    taskRepository.delete(task);

}


public List<TaskActivityResponse> getActivity(Long taskId){


    Task task=taskRepository.findById(taskId)
        .orElseThrow(
            () -> new ResourceNotFoundException("Task Not Found")
        );


    return taskActivityRepository
            .findByTask(task)
            .stream()
            .map(ActivityMapper::toResponse)
            .collect(Collectors.toList());

}


}