package com.srawan.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import com.srawan.backend.repository.TaskRepository;
import com.srawan.backend.repository.ProjectRepository;
import com.srawan.backend.repository.UserRepository;
import com.srawan.backend.entity.Task;
import com.srawan.backend.entity.Project;
import com.srawan.backend.entity.User;
import com.srawan.backend.dto.CreateTaskRequest;
import com.srawan.backend.dto.TaskActivityResponse;
import com.srawan.backend.dto.TaskResponse;
import com.srawan.backend.enums.TaskStatus;
import com.srawan.backend.dto.UpdateTaskStatusRequest;
import com.srawan.backend.entity.TaskActivity;
import com.srawan.backend.repository.TaskActivityRepository;
import com.srawan.backend.mapper.ActivityMapper;


@Service
public class TaskService {

    private TaskRepository taskRepository;
    private ProjectRepository projectRepository;
    private UserRepository userRepository;
    private TaskActivityRepository taskActivityRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository, UserRepository userRepository, TaskActivityRepository taskActivityRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.taskActivityRepository = taskActivityRepository;
    }
    
public TaskResponse createTask(CreateTaskRequest request){
    User currentUser=getCurrentUser();

    Project project =projectRepository.findById(request.getProjectId()).orElseThrow(()->new RuntimeException("Project Not Found"));


    if(!project.getTenant().id().equals(currentUser.getTenant().id())){
        throw new RuntimeException("Cannot access another tenant's project");
    }


    User assignedUser=userRepository.findById(request.getAssignedUserId()).orElseThrow(()->new RuntimeException("User Not Found"));

if(!assignedUser.getTenant().id().equals(currentUser.getTenant().id())){
    throw new RuntimeException("Cannot assign user from another tenant");

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
        task.getCreatedBy().getEmail()
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

public List<TaskResponse> myTasks(){
    User currentUser=getCurrentUser();
    return taskRepository.findByAssignedTo(currentUser).stream().map(this::mapToResponse).collect(Collectors.toList());

}


public TaskResponse updateStatus(Long taskId, UpdateTaskStatusRequest request){

    User currentUser = getCurrentUser();


    Task task = taskRepository
            .findById(taskId)
            .orElseThrow(
                () -> new RuntimeException("Task Not Found")
            );





    if(
        !task.getAssignedTo()
                .getId()
                .equals(
                    currentUser.getId()
                )
    ){

        throw new RuntimeException(
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

public List<TaskActivityResponse> getActivity(Long taskId){
    Task task=taskRepository.findById(taskId).orElseThrow(()->new RuntimeException("Task Not Found"));
    return taskActivityRepository.findByTask(task).stream().map(ActivityMapper::toResponse).collect(Collectors.toList());
}
}
